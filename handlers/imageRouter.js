// handle GET requests for [domain]/api/images - return all images
const handleAllImages = (app, Image) => {
    app.route('/api/images')
        .get(function (req, resp) {
            // use mongoose to retrieve all books from Mongo
            Image.find({}, function (err, data) {
                if (err) {
                    resp.json({ message: 'Unable to connect to images' });
                } else {
                    // return JSON retrieved by Mongo as response
                    resp.json(data);
                }
            });
        });
};

// handle requests for specific image: e.g.,  /api/images/1
const handleSingleImage = (app, Image) => {
    app.route('/api/books/:id')
        .get(function (req, resp) {
            Image.find({ id: req.params.id }, (err, data) => {
                if (err) {
                    resp.json({ message: 'Image not found' });
                } else {
                    resp.json(data);
                }
            });
        });
};

// handle requests for images for specific city:
// e.g., [domain]/api/images/city/Calgary
const handleImageByCity = (app, Image) => {
    app.route('/api/images/city/:city')
        .get(function (req, resp) {
            Image.find({ 'location.city': new RegExp(req.params.city, 'i') }, (err, data) => {
                if (err) {
                    resp.json({ message: 'Image not found' });
                } else {
                    resp.json(data);
                }
            });
        });
}; 

// handle requests for images for specific country:
// e.g., [domain]/api/images/country/canada
const handleImageByCountry = (app, Image) => {
    app.route('/api/images/country/:country')
        .get(function (req, resp) {
            Image.find({ 'location.country': new RegExp(req.params.country, 'i') }, (err, data) => {
                if (err) {
                    resp.json({ message: 'Image not found' });
                } else {
                    resp.json(data);
                }
            });
        });
};

const handlePageIndex = (app, Image) => {
    app.route('/')
        .get(function (req, resp) {
            resp.render('index', {
                title: 'Node 2 Lab',
                heading: 'Sample Pug File'
            })
        });
};
//.aggregate([ { $match: {title: {$regex: /Algebra/i}} } ])
const handlePageCountries = (app, Image) => {
    app.route('/travel')
        .get(function (req, resp) {
            // use an aggregrate function for this query
            Image.aggregate([
                { $group: { _id: "$location.country", count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ], (err, data) => {
                if (err) {
                    resp.json({ message: 'Unable to connect to images' });
                } else {
                    //resp.json(data);
                    resp.render('countries', { imageData: data });
                }
            });
        });
};

const handlePageImages = (app, Image) => {
    app.route('/travel/photos/:country')
        .get(function (req, resp) {
            // use an aggregrate function for this query
            Image.aggregate([ { $match: {'location.country': {$regex: req.params.country}} } ], (err, data) => {
                if (err) {
                    resp.json({ message: 'Unable to connect to images' });
                } else {
                    resp.render('images', { imageData: data });
                }
            });
        });
};

const handlePageSingleImage = (app, Image) => {
    app.route('/travel/photo/:id')
        .get(function (req, resp) {
            Image.find({ id: req.params.id }, (err, data) => {
                if (err) {
                    resp.render('error', { page: 'site/book' });
                } else {
                    resp.render('singleImage', { imageData: data });
                    console.log(JSON.stringify(data));
                }
            });
        });
};


module.exports = {
    handleAllImages,
    handleSingleImage,
    handleImageByCity,
    handleImageByCountry,
    handlePageIndex,
    handlePageCountries,
    handlePageImages,
    handlePageSingleImage
};