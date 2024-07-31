const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req,res,next) => {
    //get token and check if its valid
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    //verify token
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if (err) return res.sendStatus(403);


        const authorizedRoles = {
            'POST /users/sublecture/:lid': ['student', 'lecturer'],

            'GET /users/private': ['student', 'lecturer'],
            'GET /users/verifyjwt': ['student', 'lecturer'],

            'POST /courses': ['lecturer'], // only lecturers can create courses
            'POST /lectures': ['lecturer'], // only lecturers can create lectures
            'POST /lectures/:lectureID/sublectures': ['lecturer'], // only lecturers can create sub-lectures
            'PUT /courses/:id': ['lecturer'], // only lecturers can edit courses
            'PUT /lectures/:id': ['lecturer'], // only lecturers can edit lectures
            'PUT /lectures/:lectureID/sublectures/:subLectureID': ['lecturer'], // only lecturers can edit sub-lectures
            'DELETE /courses/:id': ['lecturer'], // only lecturers can delete courses
            'DELETE /lectures/:id': ['lecturer'], // only lecturers can delete lectures
            'DELETE /lectures/:lectureID/sublectures/:subLectureID': ['lecturer'], // only lecturers can delete sub-lectures
            
            'DELETE /quizzes/:id': ['lecturer'],  
            'POST /quizzes': ['lecturer'],
            'POST /quizzes/:quizID/questions': ['lecturer'],
            'PUT /quizzes': ['lecturer'],
            'PUT /quizzes/:quizID/questions': ['lecturer']

        };
        
        const userRole = user.role;
        const requestEndpoint = req.url.split('?')[0]; // Remove query parameters if present
        const method = req.method;

        console.log('Request Endpoint:', requestEndpoint); // debugging log
        console.log('User Role:', userRole); // debugging log

        // Iterate over authorized roles and handle dynamic segments
        const authorizedRole = Object.entries(authorizedRoles).find(
            ([endpoint, roles]) => {
                const [endpointMethod, path] = endpoint.split(' ');
                const pathPattern = path.replace(/:\w+/g, '\\w+'); // Replace: param with regex pattern
                const regex = new RegExp(`^${pathPattern}$`);
                return endpointMethod === method && regex.test(requestEndpoint) && roles.includes(userRole);
            }
        );

        console.log(authorizedRole)
        if (authorizedRole === false) {
            console.log('Role not authorized for this endpoint'); 
            return res.status(403).json({ message: 'Forbidden' });
        }

        req.user = user;
        next();
    })
}

module.exports = authenticateToken