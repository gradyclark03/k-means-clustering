var sum=0;
var refClustersArray=[];
var randomStudentArray=[];
var clustersArray=[];
var studentsArray=[];
var subjectDistanceArray=[];
var euclideanDistanceArray=[];
var subjectsArray=[];
var removedSubjectsArray=[];
var studentsInClusterArray=[];
var tempStudentArray=[];
var currentAssign = 0;
var nearestAssign = 0;
var studentClusterAssignment=[];
var previousStudentClusterAssignment = [];
var unrefinedClustersArray=[];
var sortedCountArray=[];
var clusterSubjectCountArray = [];
var k=0;
var unstable = 1;
var iter = 0;
var data;

//this is the master

function student(studentNo,distances){
    this.studentNumber = studentNo;
    this.distances=distances;
}


$(document).ready(function(){

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
    subjectsArray = Object.keys(data[0]);
    subjectsArray.shift();
    subjectsArray.pop();

    for(var i=0;i<subjectsArray.length;i++){
        $('#radioContainer').append("<input>"+subjectsArray[i]+"</input>").children().last().attr("type","checkbox").attr("id",subjectsArray[i]).val(subjectsArray[i]).prop("checked","true");
        $('#radioContainer').append("<br>");
    }

    $('input[type="checkbox"]').click(function(){
        if($(this).prop("checked") == false){

            removedSubjectsArray.push( $(this).val() );
            removedSubjectsArray.sort();
            console.log(removedSubjectsArray);
        }else if( $(this).prop("checked") == true){
            removedSubjectsArray.splice( (removedSubjectsArray.indexOf( $(this).val() ) ) , 1 );        
            console.log(removedSubjectsArray);
        }
    })

    $('#generateClusters').click(function(){
        generateRandomClusters();
    })

    $('#generateDistances').click(function(){
        generateRandomClusters();
        generateDistances();
    })
    
    $('#selectedSubjects').click(function(){
        checkSubjects();
    })

    $('#runAlgorithm').click(function(){

        console.clear();
        console.log(data); 
        unstable = 1;
        iter = 0;  

        checkSubjects();

        studentsArray=[];
        studentsInClusterArray=[];

        $('#subjectsList').html("");
        $('#bubbleInfo').html("");
        $('#studentInfo').html("");
        $('#clusterDescription').html("");

        for(var i=0;i<subjectsArray.length;i++){
            $("#subjectsList").append("<div></div>").children().last().html(subjectsArray[i]);
        }

        k=parseInt( $('#kNumber').val() );
        if( $('#kNumber').val() == "" ){
            k=0;
        }

        generateRandomClusters();

        while(unstable == 1){
            generateDistances();
            nearestDistance();
            convertDistanceToClusterNumber();
            checkStability();

            iter=iter+1;

            calculateNewClusters();
        }
        //console.log(unrefinedClustersArray);

        countSubjects()
        countSorting();

        bubbleGraph();

    })

    function checkSubjects(){
        subjectsArray = Object.keys(data[0]);
        subjectsArray.shift();
        subjectsArray.pop();
        
        for(var i=0;i<removedSubjectsArray.length;i++){

            subjectsArray.splice( subjectsArray.indexOf(removedSubjectsArray[i]),1 );
            
        }
        console.log(subjectsArray);
    }

    function generateRandomClusters(){
        $('#clusterContainer').html("");
        clustersArray=[];
        refClustersArray=[];
        randomStudentArray=[];
        unrefinedClustersArray=[];

        for(var i=0;i<k;i++){
            var randomStudent=Math.floor(Math.random()*88); 

            unrefinedClustersArray.push(randomStudent);

            if(randomStudentArray.includes(randomStudent) == true ){
                i = i-1;
                randomStudentArray.pop();
            }else{
                randomStudentArray.push(randomStudent);

                var studentChecker=0;

                var tempClusterStudent=[];
                var clusterStudentID=[];

                clusterStudentID.push(data[randomStudent-1]["ID:"])

                for(var j=0;j<subjectsArray.length;j++){
                    tempClusterStudent.push( parseInt( data[randomStudent-1][ subjectsArray[j] ] ) );
                }
                
                for(var j=0;j<tempClusterStudent.length;j++){
                    if(tempClusterStudent[j] == 1){
                        studentChecker=studentChecker+1;
                    }
                }

                if(studentChecker > 0){
                    tempClusterStudent.push(data[randomStudent-1]["ID"]);
                    clustersArray.push(tempClusterStudent);
                    refClustersArray.push(data[randomStudent-1]);

                    $('#clusterContainer').append("<div></div>").children().last().html("Cluster "+ (i+1) ).css({"font-weight":"bold"})
                    $('#clusterContainer').append("<div></div>").children().last().html("Student "+randomStudent).css({"text-decoration":"underline"})
                    for(var j=0;j<subjectsArray.length;j++){
                        if(clustersArray[i][j] == 1){
                            $('#clusterContainer').append("<div></div>").children().last().html(subjectsArray[j]);
                        }
                    }
                    $('#clusterContainer').append("<br>");

                }else{
                    i=i-1;
                    console.log("dud");
                    randomStudentArray.pop();
                }
            }
        }

        console.log(clusterStudentID);
        console.log(clustersArray);
        console.log(refClustersArray);
    }

    function generateDistances(){
        studentsArray=[];
        for(var i=0;i<data.length;i++){ // euclidean distance

            euclideanDistanceArray=[];

            for(var x=0;x<k;x++){
                
                subjectDistanceArray=[];
                sum=0;
                
                for(var j=0;j<subjectsArray.length;j++){ 
                    var clusterSubject=Math.pow( ( (clustersArray[x][j]) - parseInt(data[i][ subjectsArray[j] ]) ), 2); //x2-x1
                    subjectDistanceArray.push(clusterSubject);
                    
                }
                
                for(var j=0;j<subjectDistanceArray.length;j++){
                    sum = sum + subjectDistanceArray[j]; // sum of x2-x1 +...for all subjects from clusters
                }

                euclideanDistanceArray.push( Math.sqrt(sum) );
            }

            studentsArray.push( new student( 
                (i+1) , euclideanDistanceArray
            ))

        }
        console.log(studentsArray);
    }
        
    function nearestDistance(){

        studentClusterAssignment=[];

        for(var i=0;i<data.length;i++){ // find smallest cluster distance

            for(var j=0;j<k;j++){
                currentAssign = studentsArray[i]["distances"][j]; // cluster1

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
        console.log(studentClusterAssignment);
    }

    function convertDistanceToClusterNumber(){

        for(var i=0;i<data.length;i++){ // convert nearest distance to cluster number

            for(var j=0;j<k;j++){

                if(studentClusterAssignment[i] == studentsArray[i]["distances"][j]){
                    
                    studentClusterAssignment[i] = j+1;

                }

            }

        }

        console.log(studentClusterAssignment);

    }

    function calculateNewClusters(){
        clustersArray=[];
        for(var i=0;i<k;i++){
            clustersArray.push([]);
        }

        for(var i=1;i<k+1;i++){ //loop through clusters
            for(var j=0;j<subjectsArray.length;j++){ //loop through subjects
                var kSum=0;
                var kCount=0;

                for(var l=0;l<studentClusterAssignment.length;l++){ //loop through students

                    if(studentClusterAssignment[l] == i){
                        kSum= kSum+ parseInt( data[l][ subjectsArray[j] ] );
                        kCount=kCount+1;
                    }

                }

                clustersArray[i-1].push( kSum/kCount );

            }
        }

        console.log(clustersArray);

    }

    function checkStability(){
        if(iter > 0){
            if(iter>10){
                unstable=0;
            }

            var stabilitySum = 0 ;

            for(var i=0;i<studentClusterAssignment.length;i++){
                if(studentClusterAssignment[i] == previousStudentClusterAssignment[i]){
                    stabilitySum=stabilitySum+1;
                }
            }

            if(stabilitySum == studentClusterAssignment.length){
                unstable = 0;
            }

            previousStudentClusterAssignment = studentClusterAssignment;
        }else if(iter == 0){
            previousStudentClusterAssignment = studentClusterAssignment;
        }

    }

    function countSubjects(){

        for(var i=1;i<(k+1);i++){
            tempStudentArray=[];

            for(var j=0;j<studentClusterAssignment.length;j++){
                if(studentClusterAssignment[j] == i){
                    tempStudentArray.push(j);   
                }
            }

            studentsInClusterArray.push(tempStudentArray);
        }
        console.log(studentsInClusterArray);

        clusterSubjectCountArray = [];

        for(var i=0;i<k;i++){
            var selectedCluster = studentsInClusterArray[i]; 
            var tempClusterCountArray=[];

            for(var j=0;j<subjectsArray.length;j++){

                var selectedSubject = subjectsArray[j];
                var count = 0;

                for(var l=0;l<selectedCluster.length;l++){
                    var selectedStudent = selectedCluster[l];

                    if(data[ selectedStudent ][ selectedSubject ] == "1"){
                        count=count+1;
                    }
                }
                tempClusterCountArray.push(count);

            }
            clusterSubjectCountArray.push(tempClusterCountArray);
        }
        console.log(clusterSubjectCountArray);
        
    }

    function countSorting(){
        sortedCountArray=[];

        for(var i=0;i<clusterSubjectCountArray.length;i++){
            const copyClusterSubjectCountArray = JSON.parse( JSON.stringify( clusterSubjectCountArray[i] ) ); //https://javascript.plainenglish.io/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
            copyClusterSubjectCountArray.sort((a,b) => b-a);
            sortedCountArray.push(copyClusterSubjectCountArray);
        }

        console.log(sortedCountArray);

    }

    
    function bubbleGraph(){

        $('#bubbleContainer').html("");

        for(var i=0;i<k;i++){
            var selectedCluster= studentsInClusterArray[i].length;

            if(selectedCluster != 0 && selectedCluster >= 10 && selectedCluster<20){
                var rgb1=String(Math.floor(Math.random()*255));
                var rgb2=String(Math.floor(Math.random()*255));
                var rgb3=String(Math.floor(Math.random()*255));

                $('#bubbleContainer').append("<div onClick=printBubble("+i+")></div>").children().last().html(i+1).css({
                "text-align":"center","width":(selectedCluster*4)+"px","height":(selectedCluster*4)+"px",
                "border-radius":"50%","background-color":"rgb("+rgb1+","+rgb2+","+rgb3+")","float":"left",
                "display":"inline-block","margin-right":"10px","line-height":(selectedCluster*4)+"px",
                "color":"white","font-size":(1.7*(selectedCluster))+"px", "z-index":"0",
                "text-shadow": "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"}) //https://stackoverflow.com/questions/4919076/outline-effect-to-text
            }else if(selectedCluster != 0 && selectedCluster> 10){
                var rgb1=String(Math.floor(Math.random()*255));
                var rgb2=String(Math.floor(Math.random()*255));
                var rgb3=String(Math.floor(Math.random()*255));

                $('#bubbleContainer').append("<div onClick=printBubble("+i+")></div>").children().last().html(i+1).css({
                "text-align":"center","width":(selectedCluster*4)+"px","height":(selectedCluster*4)+"px",
                "border-radius":"50%","background-color":"rgb("+rgb1+","+rgb2+","+rgb3+")","float":"left",
                "display":"inline-block","margin-right":"10px","line-height":(selectedCluster*4)+"px",
                "color":"white","font-size":(selectedCluster)+"px",
                "text-shadow": "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"})
            }else if(selectedCluster != 0 && selectedCluster< 10 && selectedCluster >= 3){
                var rgb1=String(Math.floor(Math.random()*255));
                var rgb2=String(Math.floor(Math.random()*255));
                var rgb3=String(Math.floor(Math.random()*255));

                $('#bubbleContainer').append("<div onClick=printBubble("+i+")></div>").children().last().html(i+1).css({
                "text-align":"center","width":(selectedCluster*6)+"px","height":(selectedCluster*6)+"px",
                "border-radius":"50%","background-color":"rgb("+rgb1+","+rgb2+","+rgb3+")","float":"left",
                "display":"inline-block","margin-right":"10px","line-height":(selectedCluster*6)+"px",
                "color":"white","font-size":(selectedCluster*2)+"px",
                "text-shadow": "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"})
            }else if(selectedCluster == 3){
                var rgb1=String(Math.floor(Math.random()*255));
                var rgb2=String(Math.floor(Math.random()*255));
                var rgb3=String(Math.floor(Math.random()*255));

                $('#bubbleContainer').append("<div onClick=printBubble("+i+")></div>").children().last().html(i+1).css({
                "text-align":"center","width":(selectedCluster*10)+"px","height":(selectedCluster*10)+"px",
                "border-radius":"50%","background-color":"rgb("+rgb1+","+rgb2+","+rgb3+")","float":"left",
                "display":"inline-block","margin-right":"10px","line-height":(selectedCluster*10)+"px",
                "color":"white","font-size":(selectedCluster*2)+"px",
                "text-shadow": "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"})
            }else if(selectedCluster <= 2){
                var rgb1=String(Math.floor(Math.random()*255));
                var rgb2=String(Math.floor(Math.random()*255));
                var rgb3=String(Math.floor(Math.random()*255));

                $('#bubbleContainer').append("<div onClick=printBubble("+i+")></div>").children().last().html(i+1).css({
                "text-align":"center","width":(selectedCluster*15)+"px","height":(selectedCluster*15)+"px",
                "border-radius":"50%","background-color":"rgb("+rgb1+","+rgb2+","+rgb3+")","float":"left",
                "display":"inline-block","margin-right":"10px","line-height":(selectedCluster*15)+"px",
                "color":"white","font-size":(selectedCluster*8)+"px",
                "text-shadow": "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"})
            }

            $('#clusterDescription').append("<div></div>").children().last().attr("id","cluster"+(i+1)).css({"height":"100%","width":"33%","float":"left"});
            
            $("#clusterDescription").children().last().append("<div></div>").children().last().html("Cluster: "+(i+1)).css({"font-weight":"bold"});

            var previousSubject;

            for(var j=0;j<4;j++){   
                var currentSubject = subjectsArray[ clusterSubjectCountArray[i].indexOf( sortedCountArray[i][j] ) ];

                if(currentSubject != previousSubject){
                    $('#clusterDescription').children().last().append("<br>");
                    $('#clusterDescription').children().last().append("<div></div>").children().last().html( currentSubject +" - " + clusterSubjectCountArray[i][ subjectsArray.indexOf(currentSubject) ] );

                    previousSubject= currentSubject;
                }else{
      
                    var tempCountSubjectArray=[];
                    
                    for(var l=0;l<clusterSubjectCountArray[i].length;l++){

                        if(sortedCountArray[i][j] == clusterSubjectCountArray[i][l]){ // 5

                            tempCountSubjectArray.push(l);
                        }
                    }
                    console.log((i+1));
                    console.log(tempCountSubjectArray);
                    
                    for(var l=0;l<tempCountSubjectArray.length;l++){
                        currentSubject = subjectsArray[ tempCountSubjectArray[l+1] ] ;
                        l=tempCountSubjectArray.length;
                    }

                    $('#clusterDescription').children().last().append("<br>");
                    $('#clusterDescription').children().last().append("<div></div>").children().last().html( currentSubject + " - " + clusterSubjectCountArray[i][ subjectsArray.indexOf(currentSubject) ] );

                    previousSubject= currentSubject;
                }

            }

        }
    }

});

function printBubble(e){
    $('#bubbleInfo').html("");
    $('#studentInfo').html("");

    var selectedCluster= studentsInClusterArray[e];

    $('#bubbleInfo').append("<div></div>").children().last().html("Total Number: "+ selectedCluster.length)
    for(var i=0;i<selectedCluster.length;i++){
        
            $('#bubbleInfo').append("<div onClick=printStudent("+selectedCluster[i]+")></div>").children().last().html( (selectedCluster[i]+1) ).css({"height":"10px","margin-right":"10px",
            "margin-bottom":"10px","float":"left"});

    }
}

function printStudent(e){
    $('#studentInfo').html("");
    $('#studentInfo').append("<div></div>").children().last().html("Student " +(e+1)).css({"font-weight":"bold"})
    for(var i=0;i<subjectsArray.length;i++){
        if( data[e][ subjectsArray[i] ] == "1"){
            $('#studentInfo').append("<div></div>").children().last().html(subjectsArray[i]);
            $('studentInfo').append("<br>")
        }
    }
}