var k=2;
var clustersArray=[];
var studentsArray=[];
var subjectsArray=["Ab Studies","Biology","Bus Ent","Chem","Child St","Dance","D&T","Digital Technologies","Drama","English","English Lit Studies","French","F&H","Gen Maths","Geography","History","IP","Math Meth","Music","PE","Physics","Psychology","Spec Maths","WP Prac","Vetamorphus","VET","VART"];

function student(studentNo,abStudies,bio,bus,chem,childst,dance,dt,digiTech,drama,english,englishLit,french,foodHos,genMath,geo,history,IP,mathMeth,music,pe,physics,psych,specMath,wp,vetamorphus,VET,VART) {
    this.studentNumber = studentNo;
    this.abStudies = abStudies;
    this.biology = bio;
    this.business = bus;
    this.chemistry = chem;
    this.childStudies = childst;
    this.dance = dance;
    this.dt = dt;
    this.digitalTech = digiTech;
    this.drama = drama;
    this.english = english;
    this.englishLit = englishLit;
    this.french = french;
    this.foodHos = foodHos;
    this.generalMaths = genMath;
    this.geography = geo;
    this.history = history;
    this.IP = IP;
    this.mathMethods = mathMeth;
    this.music = music;
    this.PE = pe;
    this.physics = physics;
    this.biology = bio;
    this.psychology = psych;
    this.specMath = specMath;
    this.workplacePractices = wp;
    this.vetamorphus = vetamorphus;
    this.VET = VET;
    this.visualArt = VART;
}

$(document).ready(function(){
    var data;

    $.ajax({
        
        url:"Year 12 Subject Choices 2021.csv", dataType:"text", async: false,
        success: function(result){
            
            var JSONfile = csvJSON(result);
           
            data = JSON.parse(JSONfile); //data now an object
            //console.log(Object.keys(data)); //looking at keys
            //console.log(JSON.stringify(data, null, 2)) //visualise data stucture
        }   
    })
    
    //var csv is the CSV file with headers
    function csvJSON(csv){

      var lines=csv.split("\n");

      var result = [];

      var headers=lines[0].split(",");

      for(var i=1;i<(lines.length-1);i++){

          var obj = {};
          var currentline=lines[i].split(",");

          for(var j=0;j<headers.length;j++){
              obj[headers[j]] = currentline[j];
          }

          result.push(obj);

      }

      //return result; //JavaScript object
      return JSON.stringify(result); //JSON
    }
    
    console.log(data);
    

    $('#generateClusters').click(function(){
        generateRandomClusters();
    })

    $('#generateDistances').click(function(){
        generateDistances();
    })

    function generateRandomClusters(){
        clustersArray=[];
        for(var i=0;i<k;i++){
            var randomStudent=Math.floor(Math.random()*88);
            console.log(randomStudent);
            for(var j=0;j<88;j++){
                if(j==randomStudent){
                    clustersArray.push(data[j-1]);
                }
            }
        }
        console.log(clustersArray);
    }

    function generateDistances(){
        generateRandomClusters();

        for(var i=0;i<88;i++){
            for(var j=0;j<subjectsArray.length;j++){
                var x2x1=parseInt(clustersArray[0][ subjectsArray[j] ]) - parseInt(data[i][ subjectsArray[j] ]);
                var y2y1=parseInt(clustersArray[1][subjectsArray[j]]) - parseInt(data[i][ subjectsArray[j] ]);
            }
            studentsArray.push( new student( 
                (i+1) , Math.sqrt( Math.pow(x2x1,2) + Math.pow(y2y1,2))
                
                
                ));
            
        }
        console.log( studentsArray );

    }

});