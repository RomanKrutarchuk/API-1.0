//for procces.env run bash: 
// export NODE_ENV="development"
let APP_ORIGIN = "https://vercel-pfc-repository-web.vercel.app";
let START_ON = "https://vercel-pfc-repository-api.vercel.app";
const PORT = 3000

if (process.env.NODE_ENV === "development") {
  APP_ORIGIN =`http://localhost:${PORT}`;
  START_ON = `http://localhost:${PORT}`;
}

export default {
  PORT,
  DBURL:
    "mongodb+srv://ApiAdmin01:1q2w3e@clusterpfc.huvtbcz.mongodb.net/Users?retryWrites=true&w=majority",
  APP_ORIGIN,
  START_ON,
};

//for publish code on repository 1.git remote add origin https:// 1.5git remote -v 2.git push -u origin master
