const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,

    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },

    category: {
        type: String,
        default: 'General'
    },

    status: {
        type: String,
        enum: ['To do', 'In Progress', 'Completed'],
        default: 'To do'
    },

    dueDate: Date,

    archived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
