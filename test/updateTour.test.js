const request = require('supertest');
const Tour = require("../models/tourModel.js");
const app = require('../app.js');
const dbHandler = require('./dbHandler.js');

describe('PATCH', () => {
    beforeAll(async () => await dbHandler.connect());
    afterAll(async () => await dbHandler.closeDatabase());

    it('/api/v1/tours{id} returns patched tour', async () => {
        const tourToUpdate = await Tour.findOne({ name: 'Beach Paradise' }).lean();
        const patchData = {
            difficulty: 'difficult',
            price: 1200,
            duration: 10
        };

        const checkTour = (tour) => {
            expect(updatedTour).toHaveProperty('_id', tourToUpdate._id);
            expect(updatedTour).toHaveProperty('name', tourToUpdate.name);
            expect(updatedTour).toHaveProperty('duration', patchData.duration);
            expect(updatedTour).toHaveProperty('maxGroupSize', tourToUpdate.maxGroupSize);
            expect(updatedTour).toHaveProperty('difficulty', patchData.difficulty);
            expect(updatedTour).toHaveProperty('ratingsAverage', tourToUpdate.ratingsAverage);
            expect(updatedTour).toHaveProperty('ratingsQuantity', tourToUpdate.ratingsQuantity);
            expect(updatedTour).toHaveProperty('price', patchData.price);
            expect(updatedTour).toHaveProperty('priceDiscount', tourToUpdate.priceDiscount);
            expect(updatedTour).toHaveProperty('summary', tourToUpdate.summary);
            expect(updatedTour).toHaveProperty('description', tourToUpdate.description);
            expect(updatedTour).toHaveProperty('startDates', tourToUpdate.startDates);
        };

        const response = await request(app)
            .patch(`/api/v1/tours/${String(tourToUpdate._id)}`)
            .send(patchData)
            .expect('Content-Type', /json/)
            .expect(200)
        
        const updatedTour = await Tour.findById(String(tourToUpdate._id)).lean();

        checkTour(updatedTour);
        checkTour(response.body.data.tour);
    });

    it('/api/v1/tours{id} returns status "fail" and code 400 on invalid data sending', async () => {
        const tourToUpdate = await Tour.findOne({ name: 'Cultural Exploration' }).lean();

        const response = await request(app)
            .patch(`/api/v1/tours/${String(tourToUpdate._id)}`)
            .send({ name: 'too short' })
            .expect('Content-Type', /json/)
            .expect(404)
        
        expect(response.body.status).toBe('fail');
        expect(response.body).toHaveProperty('message');
    });
});