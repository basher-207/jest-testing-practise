const Tour = require("../models/tourModel.js");
const dbHandler = require('./dbHandler.js');
const { filter } = require('../utils/filtering.js');

describe('Filtering function', () => {
    beforeAll(async () => await dbHandler.connect());
    afterAll(async () => await dbHandler.closeDatabase());

    const query = {
        find: (obj) => obj
    };

    it('returns object with expected structure (option 1)', async () => {
        const queryString = { name: 'Mountain Adventure' } // ?name=Mountain+Adventure
        const result = await filter(query, queryString);
        
        expect(result).toEqual(queryString);
    });

    it('returns object with expected structure (option 2)', async () => {
        const queryString = { duration: { gte: '5' } } // ?duration[gte]=5
        const result = await filter(query, queryString);
        
        expect(result).toEqual({ duration: { $gte: "5" } });
    });

    it('returns object with expected structure (option 3)', async () => {
        const queryString = {  // ?maxGroupSize[lt]=5&maxGroupSize[gt]=1
            maxGroupSize: { lt: '5' },  
            maxGroupSize: { gt: "1" }
        };
        const result = await filter(query, queryString);
        
        expect(result).toEqual({ maxGroupSize: { $lt: "5" }, maxGroupSize: { $gt: "1" } });
    });

    it('returns empty object(option 4)', async () => {
        const queryString = {  //page=5&sort=name&limit=2&fields=name,price
            page: '5', 
            sort: 'name', 
            limit: '2', 
            fields: 'name,price'
        }; 
        const result = await filter(query, queryString);
        
        expect(result).toEqual({});
    });

    it('returns object with expected structure (option 5)', async () => {
        const queryString = {  // ?ratingsAverage[lte]=5&difficulty=medium&someField=123,456
            ratingsAverage: { lte: '5' },  
            difficulty: 'medium',
            someField: '123,456'
        };
        const result = await filter(query, queryString);
        
        expect(result).toEqual({
            ratingsAverage: { $lte: "5" },
            difficulty: 'medium',
            someField: '123,456'
        });
    });
});