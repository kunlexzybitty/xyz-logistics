const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
require('dotenv').config();

const { expect } = chai;
chai.use(chaiHttp);

//define test variables
var TestReference="";

//Check if app server is accessible
describe("Server", () => {
    it("Test startup", done => {
        chai
            .request(app)
            .get("/")
            .end((err, res) => {
            expect(res).to.have.status(200);

            done();
        });
    });
});


 describe("Endpoints", () => {
        it("Create a new delivery", done => {
            chai
                .request(app)
                .post("/delivery")
                .send({ PackageName:"TestPackage" })
                .auth(process.env.TEST_USERNAME, process.env.TEST_PASSWORD)
                .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.Status).to.equals("OK");

                if(res.body.Status==="OK") TestReference=res.body.Reference;

                done();
            });
        });

       it("Update delivery status", done => {
         chai
             .request(app)
             .put("/delivery/"+TestReference)
             .send({ Status:"IN_TRANSIT" })
             .auth(process.env.TEST_USERNAME, process.env.TEST_PASSWORD)
             .end((err, res) => {
                 expect(res).to.have.status(200);
                 expect(res.body.Status).to.equals("OK");

                 done();
             });
       });

     it("Track delivery", done => {
         chai
             .request(app)
             .get("/delivery/"+TestReference)
             .auth(process.env.TEST_USERNAME, process.env.TEST_PASSWORD)
             .end((err, res) => {
                 expect(res).to.have.status(200);
                 expect(res.body.Status).to.equals("OK");

                 done();
             });
     });


});