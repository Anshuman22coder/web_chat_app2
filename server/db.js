import mongoose from "mongoose"

export async function connectDb() {
  await mongoose.connect("mongodb+srv://anshuman22190503013_db_user:200307anshu22@cluster0.utrhfaz.mongodb.net/chatApp?retryWrites=true&w=majority&appName=webApp")
.then(()=>{
  console.log('connected to MongoDb successfully')
})

.catch((error)=>{
   console.error('Error connecting to MongoDB:', error.message);
  console.error('Full error details:', error);
})


}


const userSchema=new mongoose.Schema({
  id: {type: String,
  required:true,
  unique:true}

})
const chatSchema=new mongoose.Schema({
 

  receiver: {type: String,
  required:true,
  },
  
  sender: {type: String,
  required:true,
  } ,


  message:{type:String,
    required:true,
  },
  currentDate:{
    type:Date,
    required:true
  }

  }
)
const Messages=mongoose.model("messages",chatSchema)

const Users=mongoose.model("users",userSchema);

export {Users,Messages};


