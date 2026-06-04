import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { getResume, saveResume } from '../../lib/api';

function ResumeBuilder() {
  const user = useSelector((state) => state.auth.user);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: ''
    },
    education: [{ school: '', degree: '', field: '', year: '' }],
    experience: [{ company: '', position: '', duration: '', description: '' }],
    skills: ['']
  });

  const [generatedResume, setGeneratedResume] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await getResume(user);
        setResumeData(response);
      } catch (error) {
        console.error('Error fetching resume:', error);
      }
    };

    if (user) {
      fetchResume();
    }
  }, [user]);

  const handlePersonalInfoChange = (e) => {
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [e.target.name]: e.target.value
      }
    });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, { school: '', degree: '', field: '', year: '' }]
    });
  };

  const removeEducation = (index) => {
    const newEducation = resumeData.education.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, education: newEducation });
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, { company: '', position: '', duration: '', description: '' }]
    });
  };

  const removeExperience = (index) => {
    const newExperience = resumeData.experience.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, experience: newExperience });
  };

  const addSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, '']
    });
  };

  const removeSkill = (index) => {
    const newSkills = resumeData.skills.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, skills: newSkills });
  };

  const handleEducationChange = (index, e) => {
    const newEducation = resumeData.education.map((edu, i) => {
      if (i === index) {
        return { ...edu, [e.target.name]: e.target.value };
      }
      return edu;
    });
    setResumeData({ ...resumeData, education: newEducation });
  };

  const handleExperienceChange = (index, e) => {
    const newExperience = resumeData.experience.map((exp, i) => {
      if (i === index) {
        return { ...exp, [e.target.name]: e.target.value };
      }
      return exp;
    });
    setResumeData({ ...resumeData, experience: newExperience });
  };

  const handleSkillChange = (index, e) => {
    const newSkills = resumeData.skills.map((skill, i) => {
      if (i === index) {
        return e.target.value;
      }
      return skill;
    });
    setResumeData({ ...resumeData, skills: newSkills });
  };

  const onSaveHandler = async () => {
    try {
      if(!resumeData) return;
      const response = await saveResume(user, resumeData);
      toast.success("Information Saved");
      console.log('Resume saved:', response);
    } catch (error) {
      console.error('Error saving resume:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Resume Generated")
    console.log('Generated Resume Data:', resumeData);
    setGeneratedResume(resumeData);
  };

  const downloadResume = () => {
    if (!generatedResume) {
      toast.error("Please generate the resume first.");
      return;
    }

    const doc = new jsPDF();

    doc.text('Resume', 20, 20);
    doc.text(`Name: ${generatedResume.personalInfo.fullName}`, 20, 30);
    doc.text(`Email: ${generatedResume.personalInfo.email}`, 20, 40);
    doc.text(`Phone: ${generatedResume.personalInfo.phone}`, 20, 50);
    doc.text(`Location: ${generatedResume.personalInfo.location}`, 20, 60);

    doc.text('Education:', 20, 70);
    generatedResume.education.forEach((edu, index) => {
      doc.text(`School: ${edu.school}`, 20, 80 + index * 10);
      doc.text(`Degree: ${edu.degree}`, 20, 90 + index * 10);
      doc.text(`Field: ${edu.field}`, 20, 100 + index * 10);
      doc.text(`Year: ${edu.year}`, 20, 110 + index * 10);
    });

    doc.text('Experience:', 20, 120);
    generatedResume.experience.forEach((exp, index) => {
      doc.text(`Company: ${exp.company}`, 20, 130 + index * 10);
      doc.text(`Position: ${exp.position}`, 20, 140 + index * 10);
      doc.text(`Duration: ${exp.duration}`, 20, 150 + index * 10);
      doc.text(`Description: ${exp.description}`, 20, 160 + index * 10);
    });

    if (generatedResume.skills.length > 0 && generatedResume.skills[0] !== '') {
      doc.text('Skills:', 20, 170);
      generatedResume.skills.forEach((skill, index) => {
        doc.text(`Skill: ${skill}`, 20, 180 + index * 10);
      });
    }

    doc.save('resume.pdf');
    toast.success("Resume Downloaded")
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex mb-4">
        <BackButton />
        <h1 className="text-2xl font-bold ml-2">Resume Builder</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={resumeData.personalInfo.fullName}
                onChange={handlePersonalInfoChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={resumeData.personalInfo.email}
                onChange={handlePersonalInfoChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={resumeData.personalInfo.phone}
                onChange={handlePersonalInfoChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={resumeData.personalInfo.location}
                onChange={handlePersonalInfoChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Education</h3>
            <button
              type="button"
              onClick={addEducation}
              className="text-blue-600 hover:text-blue-700"
            >
              + Add Education
            </button>
          </div>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">School</label>
                <input
                  type="text"
                  name="school"
                  value={edu.school}
                  onChange={(e) => handleEducationChange(index, e)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, e)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Field of Study</label>
                <input
                  type="text"
                  name="field"
                  value={edu.field}
                  onChange={(e) => handleEducationChange(index, e)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Year</label>
                <input
                  type="text"
                  name="year"
                  value={edu.year}
                  onChange={(e) => handleEducationChange(index, e)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <button type="button" onClick={() => removeEducation(index)} className="text-red-600 hover:text-red-700">Remove</button>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Experience</h3>
            <button
              type="button"
              onClick={addExperience}
              className="text-blue-600 hover:text-blue-700"
            >
              + Add Experience
            </button>
          </div>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="space-y-4 mb-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, e)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={exp.position}
                    onChange={(e) => handleExperienceChange(index, e)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={exp.duration}
                    onChange={(e) => handleExperienceChange(index, e)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, e)}
                  className="w-full p-2 border rounded-md h-32"
                />
              </div>
              <button type="button" onClick={() => removeExperience(index)} className="text-red-600 hover:text-red-700">Remove</button>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Skills</h3>
            <button
              type="button"
              onClick={addSkill}
              className="text-blue-600 hover:text-blue-700"
            >
              + Add Skill
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {resumeData.skills.map((skill, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter a skill"
                />
                <button type="button" onClick={() => removeSkill(index)} className="text-red-600 hover:text-red-700">Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onSaveHandler}
            className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700"
          >
            Save Info
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Generate Resume
          </button>
          <button
            type="button"
            onClick={downloadResume}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Download Resume
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResumeBuilder;