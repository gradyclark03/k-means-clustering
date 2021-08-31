var k=3;
var sum=0;
var clustersArray=[];
var studentsArray=[];
var subjectDistanceArray=[];
var euclideanDistanceArray=[];
var sumArray=[];
var subjectsArray=["Ab Studies","Biology","Bus Ent","Chem","Child St","Dance","D&T","Digital Technologies","Drama","English","English Lit Studies","French","F&H","Gen Maths","Geography","History","IP","Math Meth","Music","PE","Physics","Psychology","Spec Maths","WP Prac","Vetamorphus","VET","VART"];
var clusterObjectArray=["cluster1","cluster2","cluster3","cluster4","cluster5","cluster6","cluster7","cluster8","cluster9","cluster10"];
var currentAssign = 0;
var nearestAssign = 0;
var studentClusterAssignment=[];
var c1Array=[];
var c2Array=[];
var c3Array=[];
var c4Array=[];
var c5Array=[];
var c6Array=[];
var c7Array=[];
var c8Array=[];
var c9Array=[];
var c10Array=[];

function studentK1(studentNo,c1) {
    this.studentNumber = studentNo;
    this.cluster1=c1;
}

function studentK2(studentNo,c1,c2) {
    this.studentNumber = studentNo;
    this.cluster1=c1;
    this.cluster2=c2;
}

function studentK3(studentNo,c1,c2,c3) {
    this.studentNumber = studentNo;
    this.cluster1=c1;
    this.cluster2=c2;
    this.cluster3=c3;
}

function studentK4(studentNo,c1,c2,c3,c4) {
    this.studentNumber = studentNo;
    this.cluster1=c1;
    this.cluster2=c2;
    this.cluster3=c3;
    this.cluster4=c4;
}

function studentK5(studentNo,c1,c2,c3,c4,c5) {
    this.studentNumber = studentNo;
    this.cluster1=c1;
    this.cluster2=c2;
    this.cluster3=c3;
    this.cluster4=c4;
    this.cluster5=c5;
}

function studentK6(studentNo,c1,c2,c3,c4,c5,c6) {
    this.studentNumber = studentNo;
    this.cluster1=c1;
    this.cluster2=c2;
    this.cluster3=c3;
    this.cluster4=c4;
    this.cluster5=c5;
    this.cluster6=c6;
}

function studentK7(studentNo,c1,c2,c3,c4,c5,c6,c7) {
    this.studentNumber = studentNo;
    this.cluster1=c1;
    this.cluster2=c2;
    this.cluster3=c3;
    this.cluster4=c4;
    this.cluster5=c5;
    this.cluster6=c6;
    this.cluster7=c7;
}

function studentK8(studentNo,c1,c2,c3,c4,c5,c6,c7,c8) {
    this.studentNumber = studentNo;
    this.cluster1=c1;
    this.cluster2=c2;
    this.cluster3=c3;
    this.cluster4=c4;
    this.cluster5=c5;
    this.cluster6=c6;
    this.cluster7=c7;
    this.cluster8=c8;
}

function studentK9(studentNo,c1,c2,c3,c4,c5,c6,c7,c8,c9) {
    this.studentNumber = studentNo;
    this.cluster1=c1;
    this.cluster2=c2;
    this.cluster3=c3;
    this.cluster4=c4;
    this.cluster5=c5;
    this.cluster6=c6;
    this.cluster7=c7;
    this.cluster8=c8;
    this.cluster9=c9;
}

function studentK10(studentNo,c1,c2,c3,c4,c5,c6,c7,c8,c9,c10) {
    this.studentNumber = studentNo;
    this.cluster1=c1;
    this.cluster2=c2;
    this.cluster3=c3;
    this.cluster4=c4;
    this.cluster5=c5;
    this.cluster6=c6;
    this.cluster7=c7;
    this.cluster8=c8;
    this.cluster9=c9;
    this.cluster10=c10;
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
        generateRandomClusters();
        generateDistances();
    })

    $('#runAlgorithm').click(function(){
        console.clear();
        console.log(data);

        studentsArray=[];

        generateRandomClusters();
        generateDistances();
        nearestDistance();
        convertDistanceToClusterNumber();

        console.log( studentsArray );   
        console.log(studentClusterAssignment);

        calculateNewClusters();
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

        clustersArray=[ data[0] , data[20] , data[40] ];
        console.clear();
        console.log(clustersArray);
    }

    function generateDistances(){
        
        for(var i=0;i<88;i++){ // euclidean distance

            sumArray=[];

            for(var x=0;x<k;x++){
                
                euclideanDistanceArray=[];
                subjectDistanceArray=[];
                sum=0;
    
                for(var j=0;j<subjectsArray.length;j++){ 
                    var clusterSubject=Math.pow( ( parseInt(clustersArray[x][ subjectsArray[j] ]) - parseInt(data[i][ subjectsArray[j] ]) ), 2); 
                    subjectDistanceArray.push(clusterSubject);
    
                }
    
                for(var j=0;j<subjectDistanceArray.length;j++){
                    sum = sum + subjectDistanceArray[j];
                }

                sumArray.push(sum);

                if( x == (k-1) ){
                    if(k==1){
                        studentsArray.push( new studentK1( 
                            (i+1) , Math.sqrt(sumArray[0])
                            
                        ));
                    }else if(k==2){
                        studentsArray.push( new studentK2( 
                            (i+1) , Math.sqrt(sumArray[0]), Math.sqrt(sumArray[1])
                            
                        ));

                    }else if(k==3){
                        studentsArray.push( new studentK3( 
                            (i+1) , Math.sqrt(sumArray[0]), Math.sqrt(sumArray[1]), Math.sqrt(sumArray[2])
                            
                        ));

                    }else if(k==4){
                        studentsArray.push( new studentK4( 
                            (i+1) , Math.sqrt(sumArray[0]), Math.sqrt(sumArray[1]), Math.sqrt(sumArray[2]), 
                            Math.sqrt(sumArray[3])
                            
                        ));

                    }else if(k==5){
                        studentsArray.push( new studentK5( 
                            (i+1) , Math.sqrt(sumArray[0]), Math.sqrt(sumArray[1]), Math.sqrt(sumArray[2]), 
                            Math.sqrt(sumArray[3]), Math.sqrt(sumArray[4])
                            
                        ));
                    }else if(k==6){
                        studentsArray.push( new studentK6( 
                            (i+1) , Math.sqrt(sumArray[0]), Math.sqrt(sumArray[1]), Math.sqrt(sumArray[2]),
                            Math.sqrt(sumArray[3]), Math.sqrt(sumArray[4]), Math.sqrt(sumArray[5])
                            
                        ));
                    }else if(k==7){
                        studentsArray.push( new studentK7( 
                            (i+1) , Math.sqrt(sumArray[0]), Math.sqrt(sumArray[1]), Math.sqrt(sumArray[2]),
                            Math.sqrt(sumArray[3]), Math.sqrt(sumArray[4]), Math.sqrt(sumArray[5]), 
                            Math.sqrt(sumArray[6])
                            
                        ));
                    }else if(k==8){
                        studentsArray.push( new studentK8( 
                            (i+1) , Math.sqrt(sumArray[0]), Math.sqrt(sumArray[1]), Math.sqrt(sumArray[2]),
                            Math.sqrt(sumArray[3]), Math.sqrt(sumArray[4]), Math.sqrt(sumArray[5]), 
                            Math.sqrt(sumArray[6]), Math.sqrt(sumArray[7])
                            
                        ));
                    }else if(k==9){
                        studentsArray.push( new studentK9( 
                            (i+1) , Math.sqrt(sumArray[0]), Math.sqrt(sumArray[1]), Math.sqrt(sumArray[2]),
                            Math.sqrt(sumArray[3]), Math.sqrt(sumArray[4]), Math.sqrt(sumArray[5]), 
                            Math.sqrt(sumArray[6]), Math.sqrt(sumArray[7]), Math.sqrt(sumArray[8])
                            
                        ));
                    }else if(k==10){
                        studentsArray.push( new studentK10( 
                            (i+1) , Math.sqrt(sumArray[0]), Math.sqrt(sumArray[1]), Math.sqrt(sumArray[2]),
                            Math.sqrt(sumArray[3]), Math.sqrt(sumArray[4]), Math.sqrt(sumArray[5]), 
                            Math.sqrt(sumArray[6]), Math.sqrt(sumArray[7]), Math.sqrt(sumArray[8]), 
                            Math.sqrt(sumArray[9])
                            
                        ));
                    }else{
                        console.log("functionality not developed yet");
                        i=87;
                    }
                }
                
            }


        }
        
    }
        
    function nearestDistance(){

        studentClusterAssignment=[];

        for(var i=0;i<88;i++){ // find smallest cluster distance

            var j=0;

            for(var j=0;j<k;j++){
                currentAssign = studentsArray[i][ clusterObjectArray[j] ]; // cluster1

                if(j==0){
                    nearestAssign = currentAssign;
                }

                if( currentAssign < nearestAssign ){ // if current <= next
                    
                    nearestAssign = currentAssign;

                }else if( currentAssign == nearestAssign){
                    
                    nearestAssign = currentAssign;

                }else if( nearestAssign < currentAssign ){
                    
                }
            }
            
            studentClusterAssignment.push(nearestAssign);

        }
    }

    function convertDistanceToClusterNumber(){

        for(var i=0;i<88;i++){ // convert nearest distance to cluster number

            for(var j=0;j<k;j++){

                if(studentClusterAssignment[i] == studentsArray[i][ clusterObjectArray[j] ]){
                    
                    studentClusterAssignment[i] = j+1;

                }

            }

        }

    }

    function calculateNewClusters(){
        for(var i=0;i<88;i++){
            if(k==1){
                if(studentClusterAssignment[i] == 1){
                    k1Array.push(i);
                }

            }else if(k==2){
                if(studentClusterAssignment[i] == 1){
                    k1Array.push(i);
                }else if(studentClusterAssignment[i] == 2){
                    k2Array.push(i);
                }

            }else if(k==3){
                if(studentClusterAssignment[i] == 1){
                    k1Array.push(i);
                }else if(studentClusterAssignment[i] == 2){
                    k2Array.push(i);
                }else if(studentClusterAssignment[i] == 3){
                    k3Array.push(i);
                }

            }else if(k==4){
                if(studentClusterAssignment[i] == 1){
                    k1Array.push(i);
                }else if(studentClusterAssignment[i] == 2){
                    k2Array.push(i);
                }else if(studentClusterAssignment[i] == 3){
                    k3Array.push(i);
                }else if(studentClusterAssignment[i] == 4){
                    k4Array.push(i);
                }

            }else if(k==5){
                if(studentClusterAssignment[i] == 1){
                    k1Array.push(i);
                }else if(studentClusterAssignment[i] == 2){
                    k2Array.push(i);
                }else if(studentClusterAssignment[i] == 3){
                    k3Array.push(i);
                }else if(studentClusterAssignment[i] == 4){
                    k4Array.push(i);
                }else if(studentClusterAssignment[i] == 5){
                    k5Array.push(i);
                }
                
            }else if(k==6){
                if(studentClusterAssignment[i] == 1){
                    k1Array.push(i);
                }else if(studentClusterAssignment[i] == 2){
                    k2Array.push(i);
                }else if(studentClusterAssignment[i] == 3){
                    k3Array.push(i);
                }else if(studentClusterAssignment[i] == 4){
                    k4Array.push(i);
                }else if(studentClusterAssignment[i] == 5){
                    k5Array.push(i);
                }else if(studentClusterAssignment[i] == 6){
                    k6Array.push(i);
                }

            }else if(k==7){
                if(studentClusterAssignment[i] == 1){
                    k1Array.push(i);
                }else if(studentClusterAssignment[i] == 2){
                    k2Array.push(i);
                }else if(studentClusterAssignment[i] == 3){
                    k3Array.push(i);
                }else if(studentClusterAssignment[i] == 4){
                    k4Array.push(i);
                }else if(studentClusterAssignment[i] == 5){
                    k5Array.push(i);
                }else if(studentClusterAssignment[i] == 6){
                    k6Array.push(i);
                }else if(studentClusterAssignment[i] == 7){
                    k7Array.push(i);
                }

            }else if(k==8){
                if(studentClusterAssignment[i] == 1){
                    k1Array.push(i);
                }else if(studentClusterAssignment[i] == 2){
                    k2Array.push(i);
                }else if(studentClusterAssignment[i] == 3){
                    k3Array.push(i);
                }else if(studentClusterAssignment[i] == 4){
                    k4Array.push(i);
                }else if(studentClusterAssignment[i] == 5){
                    k5Array.push(i);
                }else if(studentClusterAssignment[i] == 6){
                    k6Array.push(i);
                }else if(studentClusterAssignment[i] == 7){
                    k7Array.push(i);
                }else if(studentClusterAssignment[i] == 8){
                    k8Array.push(i);
                }

            }else if(k==9){
                if(studentClusterAssignment[i] == 1){
                    k1Array.push(i);
                }else if(studentClusterAssignment[i] == 2){
                    k2Array.push(i);
                }else if(studentClusterAssignment[i] == 3){
                    k3Array.push(i);
                }else if(studentClusterAssignment[i] == 4){
                    k4Array.push(i);
                }else if(studentClusterAssignment[i] == 5){
                    k5Array.push(i);
                }else if(studentClusterAssignment[i] == 6){
                    k6Array.push(i);
                }else if(studentClusterAssignment[i] == 7){
                    k7Array.push(i);
                }else if(studentClusterAssignment[i] == 8){
                    k8Array.push(i);
                }else if(studentClusterAssignment[i] == 9){
                    k9Array.push(i);
                }

            }else if(k==10){
                if(studentClusterAssignment[i] == 1){
                    k1Array.push(i);
                }else if(studentClusterAssignment[i] == 2){
                    k2Array.push(i);
                }else if(studentClusterAssignment[i] == 3){
                    k3Array.push(i);
                }else if(studentClusterAssignment[i] == 4){
                    k4Array.push(i);
                }else if(studentClusterAssignment[i] == 5){
                    k5Array.push(i);
                }else if(studentClusterAssignment[i] == 6){
                    k6Array.push(i);
                }else if(studentClusterAssignment[i] == 7){
                    k7Array.push(i);
                }else if(studentClusterAssignment[i] == 8){
                    k8Array.push(i);
                }else if(studentClusterAssignment[i] == 9){
                    k9Array.push(i);
                }else if(studentClusterAssignment[i] == 10){
                    k10Array.push(i);
                }

            }else{
                console.log("functionality not developed");
            }
        }

        clustersArray=[];

        for(var m=0;m<k;m++){
            for( var i=0;i<subjectsArray;i++ ){
                
                for(var j=0;j<data.length;j++){
                    var kSum=0;
                    kSum=kSum+ data[]
                }

            }
        }
        
                var kSum=0;
                
                
                if(k==1){
                    
    
                }else if(k==2){
    
                }else if(k==3){
    
                }else if(k==4){
    
                }else if(k==5){
                    
                }else if(k==6){
    
                }else if(k==7){
    
                }else if(k==8){
    
                }else if(k==9){
    
                }else if(k==10){
    
                }else{
                    console.log("functionality not developed");
                }


    }

    function findAverage(inputArray){
        for(var m=0;m<inputArray.length;m++){
    
            var kSum=0;
            var kAverage=0;

            for(var l=0;l<88;l++){
                kSum=kSum+inputArray[m];
            }
            kAverage=kSum/(inputArray.length);

        }
        console.log(kAverage);
    }

});