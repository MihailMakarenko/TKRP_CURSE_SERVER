// const JwtStrategy = require("passport-jwt").Strategy;
// const ExtractJwt = require("passport-jwt").ExtractJwt;
// const User = require("../models/user");

// const options = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.SECRET_KEY,
// };

// module.exports = (passport) => {
//   passport.use(
//     new JwtStrategy(options, async (payload, done) => {
//       try {
//         const user = await User.findByPk(payload.userId, {
//           attributes: ["Email", "UserId", "Role"], // Указываем поля, которые нужно вернуть
//         });

//         if (user) {
//           done(null, user);
//         } else {
//           done(null, false); // Пользователь не найден
//         }
//       } catch (e) {
//         console.log(e);
//         done(e, false); // Проблема с запросом
//       }
//     })
//   );
// };

const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }
  console.log(token);
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user; // Сохраняем информацию о пользователе в объекте запроса
    next();
  });
};

module.exports = authenticateToken;
