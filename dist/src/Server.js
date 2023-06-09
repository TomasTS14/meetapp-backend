"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("./App");
const port = process.env.PORT;
App_1.app.listen(process.env.PORT, () => {
    console.log(`Application started on port ${port}`);
});
