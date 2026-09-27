import Interview from "../models/Interview.js";

const abandonStaleInterviews = async () => {
    try {
        const cutoff = new Date(Date.now() - 15 * 60 * 1000);

        const result = await Interview.updateMany(
            {
                status: "in-progress",
                lastActivityAt: {
                    $ne: null,
                    $lt: cutoff
                }
            },
            {
                $set: {
                    status: "abandoned"
                }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`${result.modifiedCount} stale interview(s) abandoned`);
        }
    }
    catch (error) {
        console.log("Error checking stale interviews:", error);
    }
};

export default abandonStaleInterviews;