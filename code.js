console.log("codewars");
console.log("");
//map
//reduce
const numbers = [1, 2, 33, 3, 3, 3, 3, 4, 5, 6, 7, 7, 8, 9, 9, 9, 9, 10];

const findEvenNumber = (array) => {
  let res = [];
  array.map((num) => {
    if (num % 2 == 0) res.push(num);
  });
  console.log(res);
};

// findEvenNumber(numbers);

//"http://github.com/carbonfive/raygun"
//"http://www.zombie-bites.com"
//"https://www.cnet.com"
const filters = ["https", "http", "/", ":", "w",".","com"];
const firstUrl = "http://github.com/carbonfive/raygun";
const findDomain = (url) => {
  let temp = url;
  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    for (let i = 0; temp.includes(filter); i++) {
      temp = temp.replace(filter, "");
    }
  }
  console.log(temp);
};

findDomain(firstUrl);
