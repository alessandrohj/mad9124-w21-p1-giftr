import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      maxLength: 254,
      required: true
  }, 
  birthDate: {
      type: Date,
      required: true
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  gifts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Gift'}],
},
{
    timestamps: true,
  })
const Model = mongoose.model('Gift', schema)

export default Model
