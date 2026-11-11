// Central content registry: all staff-facing institutional content lives here.
// Statuses describe pilot eligibility, not a claim of third-party accreditation approval.
window.SPSS_CONFIG = Object.freeze({
  version:"2.0.0-pilot",
  brand:{
    school:"School of Sport, Psychology and Social Science",
    faculty:"Faculty of Technologies, Education and Social Sciences",
    university:"University of Bedfordshire",
    colour:"#c8102e",
    logoPath:"assets/logos/university-of-bedfordshire.png",
    logoWidth:150,
    logoHeight:62,
    logoNote:"Current image is 170x70 pixels; approved higher-resolution master artwork is still required."
  },
  pagesBase:"https://mikelnewell.github.io/SPSS-Signature-Builder-/",
  orcidIcon:"https://info.orcid.org/wp-content/uploads/2020/12/ORCIDiD_icon16x16.png",
  supportIntro:"Remember, you can contact our teams directly on the following emails and you can arrange a telephone appointment if you want to have a chat about support:",
  support:[
    {email:"student.engagement@beds.ac.uk",description:"complex issues, withdrawals and interruptions"},
    {email:"mitigation@beds.ac.uk",description:"extensions on assessment deadlines"},
    {email:"studentmoney@beds.ac.uk",description:"financial difficulties and budgeting advice"},
    {email:"mentalhealth@beds.ac.uk",description:"new or on-going mental health support"},
    {email:"counselling@beds.ac.uk",description:"professional one-to-one counselling support"},
    {email:"chaplaincy@beds.ac.uk",description:"pastoral and emotional support"},
    {email:"disability@beds.ac.uk",description:"support with a range of disabilities"},
    {email:"studyhub@beds.ac.uk",description:"support for academic skills (referencing, library resources, study skills, and Microsoft Office products)"},
    {email:"learningdevelopment@beds.ac.uk",description:"academic skills (writing, critical thinking, researching, maths/statistics, assignment/dissertation support)"}
  ],
  disciplines:[
    {id:"sport",name:"Sport and Exercise Science"},
    {id:"psychology",name:"Psychology"},
    {id:"social",name:"Social Science"}
  ],
  affiliations:[
    {id:"cases",name:"CASES",path:"assets/logos/cases.png",w:533,h:382,audience:["sport"],status:"pilot-review",note:"Chartered Association of Sport and Exercise Sciences. Relevant staff only."},
    {id:"qaa",name:"QAA UK Quality Assured",path:"assets/logos/qaa.png",w:149,h:77,audience:["all"],status:"pilot-review",note:"Confirm institutional permission before school-wide use."},
    {id:"people",name:"People & Planet award (2023/24)",path:"assets/logos/people-and-planet.png",w:388,h:177,audience:["all"],status:"historical",note:"Historical 2023/24 award. Must not be represented as a current award."},
    {id:"psa",name:"Professional Standards Authority Accredited Register",path:"assets/logos/psa.png",w:348,h:158,audience:["sport"],status:"restricted",note:"Only where the accredited-register endorsement genuinely applies."},
    {id:"basrat",name:"BASRaT",path:"assets/logos/basrat.png",w:314,h:171,audience:["sport"],status:"restricted",note:"Relevant sport rehabilitation programme only."},
    {id:"cimspa",name:"CIMSPA Higher Education Partner",path:"assets/logos/cimspa.jpg",w:506,h:126,audience:["sport"],status:"restricted",note:"Only where partner status is applicable."},
    {id:"career",name:"Career Powered Education",path:"assets/logos/career-powered.jpg",w:690,h:687,audience:["all"],status:"pilot-review",note:"University promotional identity, subject to marketing approval."},
    {id:"ahcs",name:"AHCS (Academy for Healthcare Science)",path:null,w:0,h:0,audience:["sport"],status:"pending-asset",note:"Awaiting official logo and confirmation of permitted use for MSc Clinical Exercise Physiology."}
  ],
  claims:[
    {id:"subject15",discipline:"sport",category:"Rankings",figure:"15th",headline:"in the UK for Sports Science",source:"Guardian University Guide 2027",year:2027,review:"2027 annual guide",status:"pilot-review",priority:1},
    {id:"graduate11",discipline:"sport",category:"Graduate outcomes",figure:"11th",headline:"in the UK for graduate prospects",source:"Complete University Guide 2027",year:2027,review:"2027 annual guide",status:"pilot-review",priority:2},
    {id:"career12",discipline:"sport",category:"Graduate outcomes",figure:"12th",headline:"in the UK for career prospects",source:"Guardian University Guide 2027",year:2027,review:"2027 annual guide",status:"pilot-review",priority:3},
    {id:"satisfaction13",discipline:"sport",category:"Student experience",figure:"13th",headline:"in the UK for student satisfaction",source:"Complete University Guide 2027",year:2027,review:"2027 annual guide",status:"pilot-review",priority:4},
    {id:"graduate6",discipline:"sport",category:"Graduate outcomes",figure:"6th",headline:"in the UK for graduate prospects",source:"The Times Good University Guide 2027",year:2027,review:"2027 annual guide",status:"pilot-review",priority:5},
    {id:"academic91",discipline:"sport",category:"Student experience",figure:"91%",headline:"for academic support in Sport and Exercise Sciences",source:"National Student Survey 2026",year:2026,review:"2026 annual survey",status:"pilot-review",priority:6}
  ],
  maxClaims:3
});