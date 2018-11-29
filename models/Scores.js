const mongoose = require('mongoose');
const { Schema } = mongoose;

const ScoresSchema = new Schema({
    score: Number,
    Users: {type: Schema.Types.ObjectId, ref: 'Users'} 
  });
  
  mongoose.model('Scores', ScoresSchema);