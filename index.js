const express = require('express')
const cors =require("cors")
const { v4: uuidv4 } = require('uuid');
const app = express()

let persons = [{
    id: '1',
    name: 'Sam',
    age: '26',
    hobbies: []    
}] //This is your in memory database

app.set('db', persons)


app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use((req, res) => {
    res.status(404).json({ error: "Resource not found" });
});
//TODO: Implement crud of person

// Get
app.get('/person/:id?', (req, res) => {
    try {
        const { id } = req.params;
        
        if (id) {
            const person=persons.find((item)=>item?.id==id)
            if (person) {
                return res.status(200).json(person);
            } else {
                return res.status(404).json({ error: "Person not found" });
            }
        } else {
            return res.status(200).json(Object.values(persons));
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST
app.post('/person', (req, res) => {
    try {
        const { name, age, hobbies } = req.body;

        if (!name || !age || !Array.isArray(hobbies)) {
            return res.status(400).json({ error: "Name, age, and hobbies are required" });
        }

        const id = uuidv4();
        const newPerson = { id, name, age, hobbies };
        persons.push(newPerson);

        return res.status(201).json(newPerson);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT 
app.put('/person/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, hobbies } = req.body;
        const person=persons.find((item)=>item?.id==id)

        if (!person) {
            return res.status(404).json({ error: "Person not found" });
        }

        if (name) person.name = name;
        if (age) person.age = age;
        if (Array.isArray(hobbies)) person.hobbies = hobbies;
        const otherPersons=persons?.filter((item)=>item?.id!=id)

        return res.status(200).json([...otherPersons,person]);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE 
app.delete('/person/:id', (req, res) => {
    try {
        const { id } = req.params;
        const index=persons?.findIndex((item)=>item?.id==id)

        if (index==-1) {
            return res.status(404).json({ error: "Person not found" });
        }

        delete persons[index];
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


if (require.main === module) {
    app.listen(3000)
}
module.exports = app;