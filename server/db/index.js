import mongoose from 'mongoose';

const createConnection = async () => {
    const { MONGODB_CONNECTION } = process.env;

    const uri = MONGODB_CONNECTION;
    const options = {
        autoIndex: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    try {
        await mongoose.connect(uri, options);

        console.log('CONNECTED TO MONGO DB');
    } catch (err) {
        console.log('SOMETHING WENT WRONG WHILE TRYING TO CREATE A MONGODB CONNECTION');
        console.log(err);
    }
};

createConnection();

export * from './models';
export default mongoose;
