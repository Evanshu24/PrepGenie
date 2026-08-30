import Interview from "../models/Interview.js"; 

const Dashboard = async(req,res)=>{
    try{
        const UserData = await Interview.find({userId: req.user._id });
        const averageScore = UserData => UserData.reduce((sum, interview) => sum + interview.score, 0) / Math.max(UserData.length,1);
        const maxScore =  UserData => UserData.reduce((maxScore, interview) => Math.max(maxScore,interview.score), 0);
        res.status(200).json({
            success: true,
            message: "API is working fine",
            data: {
                totalInterviews: UserData.length,
                averageScore: averageScore(UserData),
                bestScore: maxScore(UserData),
                interviewList : UserData,
            }
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export {Dashboard};