import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String,
  stream: String,
  percentage: String,
});

const skillGroupSchema = new mongoose.Schema({
  category: { type: String, enum: ['programming', 'fullstack', 'tools', 'certifications'] },
  items: [String],
});

const projectSchema = new mongoose.Schema({
  title: String,
  techStack: [String],
  description: String,
  role: String,
  responsibilities: [String],
  outcomes: [String],
});

const achievementSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
});

const volunteeringSchema = new mongoose.Schema({
  organization: String,
  role: String,
  description: String,
  duration: String,
});

const sportArtSchema = new mongoose.Schema({
  type: { type: String, enum: ['sports', 'arts', 'extracurricular'] },
  name: String,
  achievement: String,
  level: String,
});

const strengthSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const dossierSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    shareId: {
      type: String,
      unique: true,
      default: () => nanoid(10),
      index: true,
    },
    profile: {
      name: String,
      email: String,
      phone: String,
      location: String,
      cognizantId: String,
      role: String,
      track: String,
      linkedIn: String,
      github: String,
      photoUrl: String,
    },
    education: [educationSchema],
    technicalSkills: [skillGroupSchema],
    capstoneProject: projectSchema, // keep for backward compatibility if needed, but we'll use projects
    projects: [projectSchema],
    achievements: [achievementSchema],
    volunteering: [volunteeringSchema],
    sportsArts: [sportArtSchema],
    strengths: [strengthSchema],
    resumeTemplateId: { type: String, default: 'classic' },
    webPortfolioTemplateId: { type: String, default: 'minimal' },
    enableWebPortfolio: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

dossierSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Dossier', dossierSchema);
