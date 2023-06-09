const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/App.ts']

swaggerAutogen(outputFile, endpointsFiles)