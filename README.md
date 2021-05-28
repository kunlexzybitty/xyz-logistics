# xyz-logistics

This nodejs project helps manage and track deliveries.

# Installation Steps
1. Clone / download this repo
2. Install nodejs and npm on target machine
3. Install mysql and create a new database
4. Edit .env file in the project and supply Database details
5. Open command prompt to the project directory
6. Run "npm run-script build", this would install all dependencies and create tables in the database
7. Run "npm test", this would run endpoint tests
8. If all checks out fine in step 7, Run "npm start" to launch the app

Note: All endpoints require Basic Authentication, you may choose to change the values of TEST_USERNAME,TEST_PASSWORD

# Endpoints

- Create New Delivery <br/>
POST /delivery <br/>
Authentication: Basic Auth <br/>
Body (json): {
                 "PackageName":"[ADD NAME HERE]"
             }
 > Note: Max length of 200            

- Update Delivery Status <br/>
PUT /delivery/[ADD REFERENCE HERE] <br/>
Authentication: Basic Auth <br/>
Body (json): {
                 "Status":"[ADD STATUS HERE]"
             }
> Note: Status can only be IN_TRANSIT, PICKED_UP, WAREHOUSE, DELIVERED

- Track Delivery <br/>
GET /delivery/[ADD REFERENCE HERE] <br/>
Authentication: Basic Auth <br/>


# Response Codes
OK - Request was successful
ERR_404 - Resource not found
ERR_400 - Request not processed
ERR_500 - An error occurred, try again later
AUTH_FAIL - Authentication Issues
ERR - General Error
ERR_PACKAGE_NAME - Package name is required
ERR_DELIVERY_REFERENCE - Delivery reference is required
ERR_DELIVERY_STATUS - Invalid delivery status
NO_RECORD - Delivery reference does not exist
ERR_DELIVERY_DUPLICATE_PICKEDUP - Package has already been picked up
ERR_DELIVERY_STATUS_DELIVERY - Package has already been delivered
