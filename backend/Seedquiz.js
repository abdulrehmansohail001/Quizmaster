require("dotenv").config();
const mongoose = require("mongoose");
const QuizLevel = require("./models/QuizLevel");

mongoose.connect(process.env.MONGO_URI);

// ---------------- EASY ----------------
const easy = {
  level: "easy",
  questions: [
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777735589/flag-Stars-and-Stripes-May-1-1795_fbzgww.jpg",
      options: ["USA", "Canada", "UK", "Australia"],
      answer: "USA",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777735480/Flag_of_Canada__28Pantone_29_ll1wat.svg",
      options: ["USA", "Canada", "France", "Australia"],
      answer: "Canada",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777735436/Flag-United-Kingdom_uevdyf.jpg",
      options: ["Australia", "New Zealand", "UK", "Ireland"],
      answer: "UK",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802477/330px-Flag_of_Japan__281870_E2_80_931999_29.svg_emu58h.png",
      options: ["China", "Japan", "South Korea", "Taiwan"],
      answer: "Japan",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802525/Flag_of_France_rfcsyn.svg",
      options: ["Belgium", "France", "Netherlands", "Luxembourg"],
      answer: "France",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802516/960px-Flag_of_the_People_27s_Republic_of_China.svg_oh6vlk.png",
      options: ["Vietnam", "China", "North Korea", "Taiwan"],
      answer: "China",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802553/960px-Flag_of_Italy.svg_tkubok.png",
      options: ["Ireland", "Mexico", "Italy", "Hungary"],
      answer: "Italy",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802564/1280px-Flag_of_Germany.svg_caejky.png",
      options: ["Belgium", "Germany", "Austria", "Switzerland"],
      answer: "Germany",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802575/Flag_of_Brazil_vxpjte.svg",
      options: ["Argentina", "Colombia", "Brazil", "Venezuela"],
      answer: "Brazil",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802597/3840px-Flag_of_India.svg.png_tbes1q.png",
      options: ["Pakistan", "Sri Lanka", "Nepal", "India"],
      answer: "India",
    },
  ],
};

// ---------------- MEDIUM ----------------
const medium = {
  level: "medium",
  questions: [
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802614/Flag_of_Pakistan_ytlpts.svg",
      options: ["Pakistan", "Algeria", "Saudi Arabia", "Malaysia"],
      answer: "Pakistan",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802622/1280px-Flag_of_Argentina.svg_leab7v.png",
      options: ["Uruguay", "Argentina", "Greece", "El Salvador"],
      answer: "Argentina",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802641/500px-Flag_of_Switzerland.svg_vrg17n.png",
      options: ["Denmark", "Georgia", "Switzerland", "Tonga"],
      answer: "Switzerland",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802669/250px-Flag_of_Colombia.svg_sj58lh.png",
      options: ["Ecuador", "Venezuela", "Colombia", "Bolivia"],
      answer: "Colombia",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802678/Flag-Russia_thdfyy.jpg",
      options: ["Serbia", "Slovakia", "Netherlands", "Russia"],
      answer: "Russia",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802706/Flag_of_Finland_sg6ctd.svg",
      options: ["Finland", "Sweden", "Norway", "Iceland"],
      answer: "Finland",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802725/250px-Flag_of_Kenya.svg_lcy2dd.png",
      options: ["Ethiopia", "Malawi", "Kenya", "South Sudan"],
      answer: "Kenya",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802740/Flag_of_Palestine_ufldbv.svg",
      options: ["Jordan", "Palestine", "Sudan", "Yemen"],
      answer: "Palestine",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802802/1280px-Flag_of_Vietnam.svg_slxy3n.png",
      options: ["Angola", "Vietnam", "China", "Morocco"],
      answer: "Vietnam",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777804443/Flag-Greece_o9h5mh.jpg",
      options: ["Uruguay", "Finland", "Somalia", "Greece"],
      answer: "Greece",
    },
  ],
};

// ---------------- HARD ----------------
const hard = {
  level: "hard",
  questions: [
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802819/Flag-Monaco_j8wsbs.jpg",
      options: ["Monaco", "Poland", "Indonesia", "Singapore"],
      answer: "Monaco",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802833/Flag-Poland_no1dfo.jpg",
      options: ["Monaco", "Poland", "Indonesia", "Singapore"],
      answer: "Poland",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802847/Flag-Chad_ugr4pj.jpg",
      options: ["Romania", "Chad", "Andorra", "Moldova"],
      answer: "Chad",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802866/Flag-Andorra_l1ppm3.jpg",
      options: ["Chad", "Romania", "Moldova", "Andorra"],
      answer: "Andorra",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802899/Flag_of_Mali_wz1gk6.svg",
      options: ["Guinea", "Mali", "Senegal", "Cameroon"],
      answer: "Mali",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802909/Flag-Senegal_cxtkzm.jpg",
      options: ["Mali", "Senegal", "Guinea", "Cameroon"],
      answer: "Senegal",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802950/which-kazakhstan-flag-is-better-v0-jvrax50pdnib1_wakhqs.png",
      options: ["Uzbekistan", "Turkmenistan", "Kazakhstan", "Kyrgyzstan"],
      answer: "Kazakhstan",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802971/Flag-Republic-of-Georgia_v3rhpl.jpg",
      options: ["Georgia", "Armenia", "Azerbaijan", "Belarus"],
      answer: "Georgia",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777802987/Flag-Jordan_q28lkm.jpg",
      options: ["Sudan", "Iraq", "Jordan", "Palestine"],
      answer: "Jordan",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803003/1280px-Flag_of_Barbados.svg_odtp7q.png",
      options: ["Trinidad", "Barbados", "Jamaica", "Bahamas"],
      answer: "Barbados",
    },
  ],
};

// ---------------- EXTREME ----------------
const extreme = {
  level: "extreme",
  questions: [
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803069/Flag-Cyprus_voihob.jpg",
      options: ["Kosovo", "Cyprus", "Malta", "Bosnia"],
      answer: "Cyprus",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803079/Flag-Qatar_b4xlj9.jpg",
      options: ["Bahrain", "Qatar", "Kuwait", "UAE"],
      answer: "Qatar",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803127/Flag_of_Bhutan_gd38l1.svg",
      options: ["Tibet", "Nepal", "Bhutan", "Sri Lanka"],
      answer: "Bhutan",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803149/Flag-Belize_imbhgz.jpg",
      options: ["Guatemala", "Belize", "Honduras", "El Salvador"],
      answer: "Belize",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803167/Flag-Dominica_lnubcx.jpg",
      options: ["Haiti", "Jamaica", "Trinidad", "Dominica"],
      answer: "Dominica",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803193/1280px-Flag_of_the_Democratic_Republic_of_the_Congo.svg_erzech.png",
      options: ["Congo", "DR Congo", "Angola", "Zambia"],
      answer: "DR Congo",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803212/1280px-Flag_of_Kiribati.svg_u6zmf3.png",
      options: ["Tuvalu", "Fiji", "Kiribati", "Marshall Islands"],
      answer: "Kiribati",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803234/Flag-Sri-Lanka_z20vzg.jpg",
      options: ["Sri Lanka", "Nepal", "India", "Maldives"],
      answer: "Sri Lanka",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803245/1280px-Flag_of_Brunei.svg_yo5hy8.png",
      options: ["Malaysia", "Indonesia", "Brunei", "Philippines"],
      answer: "Brunei",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803257/250px-Flag_of_Albania.svg_joqjp2.png",
      options: ["Albania", "Montenegro", "Serbia", "Kosovo"],
      answer: "Albania",
    },
  ],
};

// ---------------- IMPOSSIBLE ----------------
const impossible = {
  level: "impossible",
  questions: [
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803289/Flag-Nepal_lupthr.jpg",
      options: ["Bhutan", "Nepal", "Tibet", "Sikkim"],
      answer: "Nepal",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803351/1280px-Flag_of_Vatican_City__282023_E2_80_93present_29.svg_fvscvd.png",
      options: ["Malta", "San Marino", "Vatican City", "Liechtenstein"],
      answer: "Vatican City",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803409/Flag-Cambodia_mdy19n.jpg",
      options: ["Laos", "Myanmar", "Thailand", "Cambodia"],
      answer: "Cambodia",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803431/Flag_of_Honduras__281949_E2_80_932022_2C_2026_E2_80_93present_29_eqpcik.svg",
      options: ["Honduras", "El Salvador", "Nicaragua", "Guatemala"],
      answer: "Honduras",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803445/Flag_of_Palau_zm8ca1.svg",
      options: ["Micronesia", "Nauru", "Palau", "Marshall Islands"],
      answer: "Palau",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803463/Flag_of_Grenada_fwh5yr.svg",
      options: ["Trinidad", "Barbados", "Saint Lucia", "Grenada"],
      answer: "Grenada",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803484/Flag-Nauru_m1ziqx.jpg",
      options: ["Tuvalu", "Palau", "Nauru", "Kiribati"],
      answer: "Nauru",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803499/Flag-Samoa_zoaekd.jpg",
      options: ["Samoa", "Tonga", "Fiji", "Vanuatu"],
      answer: "Samoa",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803519/Flag-Sierra-Leone_qgvmt3.jpg",
      options: ["Liberia", "Guinea", "Sierra Leone", "Ghana"],
      answer: "Sierra Leone",
    },
    {
      flag: "https://res.cloudinary.com/dxgbnqbp8/image/upload/v1777803546/Flag-Seychelles_rzusme.jpg",
      options: ["Comoros", "Cape Verde", "Maldives", "Seychelles"],
      answer: "Seychelles",
    },
  ],
};

// ---------------- SEED FUNCTION ----------------
const seedDB = async () => {
  try {
    await QuizLevel.deleteMany();
    await QuizLevel.insertMany([easy, medium, hard, extreme, impossible]);
    console.log("✅ Quiz database seeded successfully (5 levels × 10 questions)");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();