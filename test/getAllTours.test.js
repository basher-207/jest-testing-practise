const request = require('supertest');
const dbHandler = require('./dbHandler.js');
const app = require('../app.js');
const initialTestData = require('./tours-test-data.json');

describe('GET', () => {
    beforeAll(async () => await dbHandler.connect());
    afterAll(async () => await dbHandler.closeDatabase());

    it('/api/v1/tours should return tours', async () => {
        const expectedQuantity = 5;

        const response = await request(app)
            .get('/api/v1/tours')
            .expect('Content-Type', /json/)
            .expect(200);

        const testTour = initialTestData.find(tour => tour.name === 'Beach Paradise');
        const tour = response.body.data.tours.find(tour => tour.name === 'Beach Paradise');

        expect(response.body.results).toBe(expectedQuantity);
        expect(response.body.data.tours.length).toBe(expectedQuantity);
        expect(tour).toHaveProperty('_id');
        expect(tour).toHaveProperty('name', 'Beach Paradise');
        expect(tour).toHaveProperty('duration', testTour.duration);
        expect(tour).toHaveProperty('maxGroupSize', testTour.maxGroupSize);
        expect(tour).toHaveProperty('difficulty', testTour.difficulty);
        expect(tour).toHaveProperty('ratingsAverage', testTour.ratingsAverage);
        expect(tour).toHaveProperty('ratingsQuantity', testTour.ratingsQuantity);
        expect(tour).toHaveProperty('price', testTour.price);
        expect(tour).toHaveProperty('priceDiscount', testTour.priceDiscount);
        expect(tour).toHaveProperty('summary', testTour.summary);
        expect(tour).toHaveProperty('description', testTour.description);
        expect(tour).not.toHaveProperty('createdAt');
        expect(tour).toHaveProperty('startDates');
    });

    it('/api/v1/tours?name=Mountain+Adventure returns one article with expected properties', async () => {
        const expectedQuantity = 1;

        const response = await request(app)
            .get('/api/v1/tours?name=Mountain+Adventure')
            .expect('Content-Type', /json/)
            .expect(200);
        
        const tour = response.body.data.tours[0];
        const testTour = initialTestData.find(tour => tour.name === 'Mountain Adventure');

        expect(response.body.results).toBe(expectedQuantity);
        expect(response.body.data.tours.length).toBe(expectedQuantity);
        expect(tour).toHaveProperty('_id');
        expect(tour).toHaveProperty('name', testTour.name);
        expect(tour).toHaveProperty('duration', testTour.duration);
        expect(tour).toHaveProperty('maxGroupSize', testTour.maxGroupSize);
        expect(tour).toHaveProperty('difficulty', testTour.difficulty);
        expect(tour).toHaveProperty('ratingsAverage', testTour.ratingsAverage);
        expect(tour).toHaveProperty('ratingsQuantity', testTour.ratingsQuantity);
        expect(tour).toHaveProperty('price', testTour.price);
        expect(tour).toHaveProperty('priceDiscount', testTour.priceDiscount);
        expect(tour).toHaveProperty('summary', testTour.summary);
        expect(tour).toHaveProperty('description', testTour.description);
        expect(tour).not.toHaveProperty('createdAt');
        expect(tour).toHaveProperty('startDates');
    });

    it('/api/v1/tours?maxGroupSize[gt]=20 returns two tours', async () => {
        const expectedQuantity = 2;
        const response = await request(app)
            .get('/api/v1/tours?maxGroupSize[gte]=20')
            .expect('Content-Type', /json/)
            .expect(200);

        const tours = response.body.data.tours;
        const testTours = initialTestData.filter(tour => tour.maxGroupSize >= 20);

        expect(response.body.results).toBe(expectedQuantity);
        expect(response.body.data.tours.length).toBe(expectedQuantity);
        expect(tours.length).toBe(testTours.length);
    });

    it('/api/v1/tours?difficulty=medium returns two tours', async () => {
        const expectedQuantity = 2;

        const response = await request(app)
            .get('/api/v1/tours?difficulty=medium')
            .expect('Content-Type', /json/)
            .expect(200);

        const tours = response.body.data.tours;
        const testTours = initialTestData.filter(tour => tour.difficulty === 'medium');

        expect(response.body.results).toBe(expectedQuantity);
        expect(response.body.data.tours.length).toBe(expectedQuantity);
        expect(tours.length).toBe(testTours.length);
    });

    it('/api/v1/tours?ratingsAverage[gte]=4.5&price[lte]=1800 returns three tours', async () => {
        const expectedQuantity = 3;

        const response = await request(app)
            .get('/api/v1/tours?ratingsAverage[gte]=4.5&price[lte]=1800')
            .expect('Content-Type', /json/)
            .expect(200);
        
        const tours = response.body.data.tours;
        const testTours = initialTestData.filter(tour => tour.ratingsAverage >= 4.5 && tour.price <= 1800);
        
        expect(response.body.results).toBe(expectedQuantity);
        expect(response.body.data.tours.length).toBe(expectedQuantity);
        expect(tours.length).toBe(testTours.length);
    });

    it('/api/v1/tours?limit=4 "limit" should not affect the result', async () => {
        const expectedQuantity = 5;

        const response = await request(app)
            .get('/api/v1/tours?limit=4')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.results).toBe(expectedQuantity);
        expect(response.body.data.tours.length).toBe(expectedQuantity);
    });
});