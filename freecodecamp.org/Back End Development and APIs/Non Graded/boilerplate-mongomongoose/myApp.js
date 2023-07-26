const mongoose = require('mongoose');

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB!');
    // Additional code here if needed
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

require('dotenv').config();




const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favoriteFoods: [String]
});

let Person = mongoose.model('Person', personSchema);

const createAndSavePerson = (done) => {
  const person = new Person({
    name: "Haribahadur",
    age: 21,
    favoriteFoods: ["burger", "chowmein"]
  });

  person.save(function(err, data) {
    if (err) {
      console.error('Error saving person:', err);
    } else {
      console.log('Person saved successfully:', data);
    }
    // Call the done function, if provided, to signal completion
    if (done) {
      done(err, data);
    }
  });
};


const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, createdPeople) => {
    if (err) {
      console.error('Error creating people:', err);
    } else {
      console.log('People created successfully:', createdPeople);
    }
    // Call the done function, if provided, to signal completion
    if (done) {
      done(err, createdPeople);
    }
  });
};

const findPeopleByName = (personName, done) => {
  // Use the Person model to find people with the given name
  Person.find({ name: personName }, (err, foundPeople) => {
    if (err) {
      console.error('Error finding people:', err);
    } else {
      console.log('People found successfully:', foundPeople);
    }
    // Call the done function, if provided, to signal completion
    if (done) {
      done(err, foundPeople);
    }
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, foundfood) => {
    if (err) {
      console.error('Error finding people:', err);
    } else {
      console.log('People found successfully:', foundfood);
    }
    // Call the done function, if provided, to signal completion
    if (done) {
      done(err, foundfood);
    }
  });
};
// Find person by ID
const findPersonById = (personId, done) => {
  Person.findById(personId, (err, foundPerson) => {
    done(err, foundPerson);
  });
};

// Find, edit, and then save person
const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, (err, foundPerson) => {
    if (err) return done(err);

    foundPerson.favoriteFoods.push(foodToAdd);
    foundPerson.save((err, updatedPerson) => {
      done(err, updatedPerson);
    });
  });
};

// Find and update person
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate({ name: personName }, { age: ageToSet }, { new: true }, (err, updatedPerson) => {
    done(err, updatedPerson);
  });
};

// Remove person by ID
const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removedPerson) => {
    done(err, removedPerson);
  });
};

// Remove people by name
const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.deleteMany({ name: nameToRemove }, (err, result) => {
    done(err, result);
  });
};

// Chain search query
const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 })
    .limit(2)
    .select({ age: 0 })
    .exec((err, foundPeople) => {
      done(err, foundPeople);
    });
};


/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
