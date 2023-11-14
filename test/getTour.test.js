const request = require('supertest');
const dbHandler = require('./dbHandler.js');
const Tour = require('../models/tourModel.js');
const app = require('../app.js');
const initialTestData = require('./tours-test-data.json');

describe('GET', () => {
    beforeAll(async () => await dbHandler.connect());
    afterAll(async () => await dbHandler.closeDatabase());

    it('/api/v1/tours/{id} returns a tour with expected properties', async () => {
        const tourToGet = await Tour.findOne({name: 'Wildlife Safari'});

        const response = await request(app)
            .get(`/api/v1/tours/${String(tourToGet._id)}`)
            .expect('Content-Type', /json/)
            .expect(200);

        const tour = response.body.data.tour;
        const testTour = initialTestData.find(tour => tour.name === 'Wildlife Safari');

        expect(response.body.status).toBe('success');
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

    it('/api/v1/tours/{id} returns json with 404 and "fail" status on invalid "id"', async () => {
        const response = await request(app)
            .get('/api/v1/tours/12345')
            .expect('Content-Type', /json/)
            .expect(404);
        
        expect(response.body.status).toBe('fail');
        expect(response.body).toHaveProperty('message');
    })
});