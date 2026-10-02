import mongoose from "mongoose";

const allowedSchema = new mongoose.Schema({
    roles: [String],
    keywords: [String]
}, {
    collection: "allowed"
});

const prepgenieDB = mongoose.connection.useDb("prepgenie");

export default prepgenieDB.model("Allowed", allowedSchema);
