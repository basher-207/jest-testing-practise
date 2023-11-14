const request = require('supertest');
const Tour = require("../models/tourModel.js");
const app = require('../app.js');
const dbHandler = require('./dbHandler.js');

describe('PATCH', () => {
    beforeAll(async () => await dbHandler.connect());
    afterAll(async () => await dbHandler.closeDatabase());

    it('/api/v1/tours{id} delete tour and return status "success" with code 204', async () => {
        const tourToDelete = await Tour.findOne({ name: 'Mountain Adventure' });
        const deletedTourId = String(tourToDelete._id);
        
        const response = await request(app)
            .delete(`/api/v1/tours/${deletedTourId}`)
            .expect(204)

        const tours = await Tour.find();
        const deletedTour = await Tour.findById(deletedTourId);

        expect(tours.length).toBe(4)
        expect(deletedTour).toBeNull();
    });

    it('/api/v1/tours{id} return status "fail" with code 404', async () => {
        const response = await request(app)
            .delete(`/api/v1/tours/12345`)
            .expect(404)

        expect(response.body.status).toBe('fail');
        expect(response.body).toHaveProperty('message');
    });
});