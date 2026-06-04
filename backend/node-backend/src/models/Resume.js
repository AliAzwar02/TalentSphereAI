import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    personalInfo: {
        fullName: String,
        email: String,
        phone: String,
        location: String
    },
    education: [
        {
            school: String,
            degree: String,
            field: String,
            year: String
        }
    ],
    experience: [
        {
            company: String,
            position: String,
            duration: String,
            description: String
        }
    ],
    skills: [String]
});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;