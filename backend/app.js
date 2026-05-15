const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const notesRoutes = require('./routes/notesRoutes');

const path = require('path');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use(express.json());


app.use('/api/notes',
    notesRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({
        message: 'Server is healthy'
    });
});

app.use(
    express.static(
        path.join(
            __dirname,
            'public'
        )
    )
);

app.get(
    '/',
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                'public',
                'index.html'
            )
        );
    }
);

const PORT =
    process.env.PORT
    || 5000;

app.listen(
    PORT,
    '0.0.0.0',
    () => {

        console.log(
            `Server running on port ${PORT}`
        );
    }
);