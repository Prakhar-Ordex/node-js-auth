const Employee = require("../models/employee.model");


const createUser = async (req, res) => {
    const { name, department, salary, joiningDate } = req.body;

    try {
        if (!name || !department || !salary || !joiningDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const employee = await Employee.create({ name, department, salary, joiningDate });
        res.status(201).json({employee:employee,message:"employee created successfully"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Server Error' });
    }
} 

const getAllUsers = async (_, res) => {
    try {
        const employees = await Employee.findAll();
        res.json(employees);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Server Error' });
    }
}

const updateUser = async (req, res) => {

    try {
        const { id } = req.params;
        const { name, department, salary, joiningDate } = req.body;

        if (!id || !name || !department || !salary || !joiningDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const employee = await Employee.findByPk(id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        await Employee.update({ name, department, salary, joiningDate }, { where: { id } });

        const updatedUSer = await Employee.findByPk(id);
        return res.status(201).json({ updateUser: updatedUSer,message:"update user successfully" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Server Error' });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

       await Employee.destroy({
            where: {
                id
            },
        });
        // const employees = await Employee.findAll();
        return res.status(200).json({ message: 'Employee deleted successfully'});

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Server Error' });

    }
}

const bulkCreate = async (req, res) => {
    try {
        if(!req.body) return res.status(404).json({ message: 'plese send data'});
        const captains = await Employee.bulkCreate(req.body);
        console.log(captains.length); 
        console.log(captains[0].name); 
        console.log(captains[0].id); 
        res.status(201).json(captains);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Server Error' });
    }
}

const findUserbyId = async(req,res) =>{
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json({ data: employee})
    } catch (error) {
        console.log(error)
    }
}


module.exports = { createUser, getAllUsers, updateUser, deleteUser,bulkCreate,findUserbyId };