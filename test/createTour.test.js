const request = require('supertest');
const Tour = require("../models/tourModel.js");
const app = require('../app.js');
const dbHandler = require('./dbHandler.js');

describe('POST', () => {
    beforeAll(async () => await dbHandler.connect());
    afterAll(async () => await dbHandler.closeDatabase());

    const checkTour = (tour, input) => {
        expect(tour).toHaveProperty('_id');
        expect(tour).toHaveProperty('name', input.name);
        expect(tour).toHaveProperty('duration', input.duration);
        expect(tour).not.toHaveProperty('maxGroupSize');
        expect(tour).toHaveProperty('difficulty', input.difficulty);
        expect(tour).toHaveProperty('ratingsAverage', 4.5);
        expect(tour).toHaveProperty('ratingsQuantity', input.ratingsQuantity);
        expect(tour).toHaveProperty('price', input.price);
        expect(tour).not.toHaveProperty('priceDiscount');
        expect(tour).toHaveProperty('summary', input.summary);
        expect(tour).toHaveProperty('description', input.description);
        expect(tour).toHaveProperty('startDates', []);
    };

    it('/api/v1/tours creates a tour and return it in response', async () => {
        const tourInputData = {
            name: 'Test creation tour',
            duration: 25,
            difficulty: 'easy',
            ratingsQuantity: 2,
            price: 500,
            summary: 'It is a test tour summary.',
            description: 'Test tour description.'
        };

        const response = await request(app)
        .post('/api/v1/tours')
        .send(tourInputData)
        .expect(201)

        const createdTour = await Tour.findOne({name: tourInputData.name}).lean();

        expect(response.body.status).toBe('success');
        checkTour(createdTour, tourInputData);
        checkTour(response.body.data.tour, tourInputData);
    });

    it('/api/v1/tours returns status "fail" and code 400 on invalid data sending', async () => {
        const response = await request(app)
        .post('/api/v1/tours')
        .send({
            name: 'Test tour name',
            price: 1000
        })
        .expect(400)

        expect(response.body.status).toBe('fail');
        expect(response.body).toHaveProperty('message');
    });
});



