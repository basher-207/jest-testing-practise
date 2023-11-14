const Tour = require("../models/tourModel.js");
const dbHandler = require("./dbHandler.js");

describe('Tour schema "name" field', () => {
    beforeAll(async () => {
        await dbHandler.connect();
    });
    beforeEach(async () => {
        await Tour.deleteMany();
    });
    afterAll(async () => {
        await dbHandler.clearDatabase();
        await dbHandler.closeDatabase();
    });
  
    it('is mandatory', async () => {
        const tour = new Tour({
            difficulty: "easy",
            price: 100
        });
        
        await expect(tour.validate()).rejects.toThrow('A tour must have a name');
    });
  
    it('min length is 10 characters', async () => {
        const tour = new Tour({
            name: "Only 6",
            difficulty: "easy",
            price: 100
        });

        await expect(tour.validate()).rejects.toThrow(
        'A tour name must have more or equal then 10 characters'
      );
    });

    it('has to be unique', async () => {
        const tour1 = new Tour({
            name: "Test tour number 1",
            difficulty: "medium",
            price: 100
        });
        const tour2 = new Tour({
            name: "Test tour number 1",
            difficulty: "medium",
            price: 100
        });

        await tour1.save();
        await expect(tour2.save()).rejects.toThrow()
    });

    it('have to be trimmed', async () => {
        const inputData = {
            name: "   Not trimmed tour name   ",
            difficulty: "medium",
            price: 100
        };
        const testTour = new Tour(inputData);
        
        expect(testTour.name).toBe(inputData.name.trim());
    });
});

describe('Tour schema "duration" field', () => {
    beforeAll(async () => {
        await dbHandler.connect();
    });
    beforeEach(async () => {
        await Tour.deleteMany();
    });
    afterAll(async () => {
        await dbHandler.clearDatabase();
        await dbHandler.closeDatabase();
    });

    it('has to be rejected on "save()", when typeof input data for "duration" field is string', async () => {
        const tour = new Tour({
            name: "Test tour name1",
            duration: "smth",
            difficulty: "easy",
            price: 100,
        });

    await expect(tour.save()).rejects.toThrow();
    });

    it('has to resolve on "save()", when typeof input data for "duration" field is number', async () => {
        const tour = new Tour({
            name: "Test tour name1",
            duration: 1234,
            difficulty: "easy",
            price: 100,
        });

    await expect(tour.save()).resolves.toBe(tour);
    });
});

describe('Tour schema "maxGroupSize" field', () => {
    beforeAll(async () => {
        await dbHandler.connect();
    });
    beforeEach(async () => {
        await Tour.deleteMany();
    });
    afterAll(async () => {
        await dbHandler.clearDatabase();
        await dbHandler.closeDatabase();
    });

    it('has to be rejected on "save()", when typeof input data for "maxGroupSize" field is string', async () => {
        const tour = new Tour({
            name: "Test tour name1",
            maxGroupSize: "smth",
            difficulty: "easy",
            price: 100,
        });

        await expect(tour.save()).rejects.toThrow();
    });

    it('has to resolve on "save()", when typeof input data for "maxGroupSize" field is number', async () => {
        const tour = new Tour({
            name: "Test tour name1",
            maxGroupSize: 1234,
            difficulty: "easy",
            price: 100,
        });

        await expect(tour.save()).resolves.toBe(tour);
    });
});

describe('Tour schema "difficulty" field', () => {
    beforeAll(async () => {
        await dbHandler.connect();
    });
    beforeEach(async () => {
        await Tour.deleteMany();
    });
    afterAll(async () => {
        await dbHandler.clearDatabase();
        await dbHandler.closeDatabase();
    });

    it('is mandatory', async () => {
        const tour = new Tour({
            name: "Test tour name1",
            price: 100,
        });

        await expect(tour.validate()).rejects.toThrow('A tour must have a difficulty');
    });

    it('can be called only with values: "easy", "medium", "difficult"', async () => {
        const invalidValue = "notEasy"
        const tour = new Tour ({
            name: "test name with wrong difficulty",
            difficulty: invalidValue,
            price: 100,
        });

        await expect(tour.validate()).rejects.toThrow('Difficulty is either: easy, medium, difficult');
    });
});

describe('Tour schema "ratingsAverage" field', () => {
    beforeAll(async () => {
        await dbHandler.connect();
    });
    beforeEach(async () => {
        await Tour.deleteMany();
    });
    afterAll(async () => {
        await dbHandler.clearDatabase();
        await dbHandler.closeDatabase();
    });

    it('should be "4.5" as default', () => {
        const tour = new Tour ({
            name: "test tour name",
            difficulty: "easy",
            price: 100,
        });

        expect(tour.ratingsAverage).toBe(4.5);
    });

    it('should throw an error when value is less than "1"', async () => {
        const tour = new Tour({
            ratingsAverage: 0.5,
            name: "test tour name",
            difficulty: "easy",
            price: 100,
        });

        await expect(tour.validate()).rejects.toThrow('Rating must be above 1.0');
    });

    it('should throw an error when value is greater than "5"', async () => {
        const tour = new Tour({
            ratingsAverage: 5.5,
            name: "test tour name",
            difficulty: "easy",
            price: 100,
        });

        await expect(tour.validate()).rejects.toThrow('Rating must be below 5.0');
    });
});

describe('Tour schema "ratingsQuantity" field', () => {
    beforeAll(async () => {
        await dbHandler.connect();
    });
    beforeEach(async () => {
        await Tour.deleteMany();
    });
    afterAll(async () => {
        await dbHandler.clearDatabase();
        await dbHandler.closeDatabase();
    });

    it('should be "0" as default', () => {
        const tour = new Tour ({
            name: "test tour name",
            difficulty: "easy",
            price: 100,
        });

        expect(tour.ratingsQuantity).toBe(0);
    });

    it('should reject on "string" input', async () => {
        const tour = new Tour ({
            ratingsQuantity: "11a",
            name: "test tour name",
            difficulty: "easy",
            price: 100,
        });

        await expect(tour.validate()).rejects.toThrow()
    });
});

describe('Tour schema "priceDiscount" field', () => {
    beforeAll(async () => {
        await dbHandler.connect();
    });
    beforeEach(async () => {
        await Tour.deleteMany();
    });
    afterAll(async () => {
        await dbHandler.clearDatabase();
        await dbHandler.closeDatabase();
    });

    it('should throw an exception when trying to create "priceDiscount" value greater than "price" value', async () => {
        const invalidInputData = {
            name: "test tour name",
            difficulty: "easy",
            price: 100,
            priceDiscount: 101
        };

        await expect(Tour.create(invalidInputData)).rejects.toThrow(`Discount price (${invalidInputData.priceDiscount}) should be below regular price`); 
    });
});

describe('Tour schema "createdAt" field', () => {
    const now = new Date('4 Oct 2023');
    function mockNow() {
        global.Date = jest.fn().mockImplementation(() => now); // mock Date "new" constructor
        global.Date.now = jest.fn().mockReturnValue(now.valueOf()); // mock Date.now
    };
    beforeAll(async () => {
        mockNow();
        await dbHandler.connect();
    });
    beforeEach(async () => {
        await Tour.deleteMany();
    });
    afterAll(async () => {
        jest.clearAllMocks();
        await dbHandler.clearDatabase();
        await dbHandler.closeDatabase();
    });

    it('has default value of current time on creation', async () => {
        const tour = await Tour.create({
            name: "test tour name",
            difficulty: "easy",
            price: 100,
        });

        expect(tour.createdAt).toEqual(now);
    });
});

describe('Tour schema "price", "summary", "description", "startDates" fields', () => {
    beforeAll(async () => {
        await dbHandler.connect();
    });
    beforeEach(async () => {
        await Tour.deleteMany();
    });
    afterAll(async () => {
        await dbHandler.clearDatabase();
        await dbHandler.closeDatabase();
    });

    it('"price" field is mandatory', async () => {
        const tour = new Tour({
            name: "test tour name",
            difficulty: "easy"
        });

        await expect(tour.validate()).rejects.toThrow('A tour must have a price');
    });

    it('"summary" field value have to be "string" type', async () => {
        const tour = new Tour({
            summary: true,
            name: "test tour name",
            difficulty: "easy",
            price: 100
        });
        const savedTour = await tour.save();

        expect(typeof savedTour.summary).toBe('string');
    });

    it('"description" field have to be trimmed', async () => {
        const notTrimmedDescr = "  description not trimmed    ";
        const tour = new Tour({
            description: notTrimmedDescr,
            name: "test tour name",
            difficulty: "easy",
            price: 100
        });

        await expect(tour.description).toBe(notTrimmedDescr.trim());
    });

    it('"startDates" field has to be saved with 3 different dates', async () => {
        const datesArr = [ new Date('1 Sep 2022'), new Date('2 Oct 2023'), new Date('3 Nov 2024')];
        const tour = await Tour.create({
            name: "test tour name",
            difficulty: "easy",
            price: 100,
            startDates: datesArr
        });

        expect(tour.startDates.length).toBe(3);
        expect(tour.startDates.toString()).toEqual(datesArr.toString());
    });
});


