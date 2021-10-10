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
var subjectCountArray=[];
var k=0;
var unstable = 1;
var iter = 0;
var data;
var printedStudentInfo=0;

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
    // start of new branch
    
    console.log(data);
    subjectsArray = Object.keys(data[0]);
    subjectsArray.shift();
    subjectsArray.pop();

    for(var i=0;i<subjectsArray.length;i++){

        if(i<( (subjectsArray.length)/2 )){
            $('#leftRadioContainer').append("<div></div>").children().last().css({"width":"100%","float":"left"})
            $('#leftRadioContainer').children().last().append("<input>"+subjectsArray[i]+"</input>").children().last().attr("type","checkbox").attr("id",subjectsArray[i]).val(subjectsArray[i]).prop("checked","true");

            $("#leftSubjectsList").append("<div></div>").children().last().html(subjectsArray[i]).css({"width":"100%","float":"left"});
        }else{
            $('#rightRadioContainer').append("<div></div>").children().last().css({"width":"100%","float":"left"})
            $('#rightRadioContainer').children().last().append("<input>"+subjectsArray[i]+"</input>").children().last().attr("type","checkbox").attr("id",subjectsArray[i]).val(subjectsArray[i]).prop("checked","true");

            $("#rightSubjectsList").append("<div></div>").children().last().html(subjectsArray[i]).css({"width":"100%","float":"left"});
        }

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
        
        checkSubjects();
        
        $('#leftSubjectsList').html("");
        $('#rightSubjectsList').html("");

        for(var i=0;i<subjectsArray.length;i++){
            if(i<( (subjectsArray.length)/2 )){
                $("#leftSubjectsList").append("<div></div>").children().last().html(subjectsArray[i]).css({"width":"100%","float":"left"});
            }else{
                $("#rightSubjectsList").append("<div></div>").children().last().html(subjectsArray[i]).css({"width":"100%","float":"left"});
            }
        }
    })

    /*$('#generateClusters').click(function(){
        generateRandomClusters();
    })

    $('#generateDistances').click(function(){
        generateRandomClusters();
        generateDistances();
    })
    
    $('#selectedSubjects').click(function(){
        checkSubjects();
    })*/

    $('#runAlgorithm').click(function(){

        console.clear();
        console.log(data); 
        unstable = 1;
        iter = 0;  

        checkSubjects();

        studentsArray=[];
        studentsInClusterArray=[];

        $('#leftSubjectsList').html("");
        $('#rightSubjectsList').html("");
        
        $('#bubbleInfo').html("");
        $('#studentInfo').html("");
        $('#clusterDescription').html("");

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

        printedStudentInfo=0;
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
        $('#clusterInnerContainer').html("");
        clustersArray=[];
        refClustersArray=[];
        randomStudentArray=[];
        unrefinedClustersArray=[];

        if(k>3){
            for(var i=0;i<2;i++){
                $('#clusterInnerContainer').append("<div></div>").children().last().attr("id","clusterInnerContainer"+(i+1)).css({"width":"100%","height":"50%","float":"left","border":"2px solid black"})
            }
        }

        for(var i=0;i<k;i++){
            var randomStudent=Math.ceil(Math.random()*88); 

            unrefinedClustersArray.push(randomStudent);

            if(randomStudentArray.includes(randomStudent) == true ){
                i = i-1;
                randomStudentArray.pop();
            }else{
                randomStudentArray.push(randomStudent);

                var studentChecker=0;

                var tempClusterStudent=[];
                var clusterStudentID=[];

                clusterStudentID.push(data[randomStudent-1]["ID:"]);

                for(var j=0;j<subjectsArray.length;j++){
                    tempClusterStudent.push( parseInt( data[randomStudent-1][ subjectsArray[j] ] ) );
                }
                
                for(var j=0;j<tempClusterStudent.length;j++){
                    if(tempClusterStudent[j] == 1){
                        studentChecker=studentChecker+1;
                    }
                }

                if(k<=3){
                    $('#clusterInnerContainer').append("<div></div>").children().last().css({"width":(100/(k))+"%","height":"200px","float":"left"});
                }else{

                    if(k == 4){
                        if(i<=1){
                            $('#clusterInnerContainer1').append("<div></div>").children().last().css({"width":(100/(Math.ceil(k/2)))+"%","height":"200px","float":"left"});
                        }else{
                            $('#clusterInnerContainer2').append("<div></div>").children().last().css({"width":(100/(Math.floor(k/2)))+"%","height":"200px","float":"left"});
                        }    
                    }else{
                        if(i<=2){
                            $('#clusterInnerContainer1').append("<div></div>").children().last().css({"width":(100/(Math.ceil(k/2)))+"%","height":"200px","float":"left"});
                        }else{
                            $('#clusterInnerContainer2').append("<div></div>").children().last().css({"width":(100/(Math.floor(k/2)))+"%","height":"200px","float":"left"});
                        }    
                    }                                                                              
                }


                if(studentChecker > 0){
                    tempClusterStudent.push(data[randomStudent-1]["ID"]);
                    clustersArray.push(tempClusterStudent);
                    refClustersArray.push(data[randomStudent-1]);

                    if(k<=3){
                        $('#clusterInnerContainer').children().last().append("<div></div>").children().last().html("Cluster "+ (i+1) ).css({"font-weight":"bold"});
                        $('#clusterInnerContainer').children().last().append("<div></div>").children().last().html("Student "+randomStudent).css({"text-decoration":"underline"});
                    }else{

                        if(k==4){
                            if(i<=1){
                                $('#clusterInnerContainer1').children().last().append("<div></div>").children().last().html("Cluster "+ (i+1) ).css({"font-weight":"bold"});
                                $('#clusterInnerContainer1').children().last().append("<div></div>").children().last().html("Student "+randomStudent).css({"text-decoration":"underline"});
                            }else{
                                $('#clusterInnerContainer2').children().last().append("<div></div>").children().last().html("Cluster "+ (i+1) ).css({"font-weight":"bold"});
                                $('#clusterInnerContainer2').children().last().append("<div></div>").children().last().html("Student "+randomStudent).css({"text-decoration":"underline"});
                            }
                        }else{
                            if(i<=2){
                                $('#clusterInnerContainer1').children().last().append("<div></div>").children().last().html("Cluster "+ (i+1) ).css({"font-weight":"bold"});
                                $('#clusterInnerContainer1').children().last().append("<div></div>").children().last().html("Student "+randomStudent).css({"text-decoration":"underline"});
                            }else{
                                $('#clusterInnerContainer2').children().last().append("<div></div>").children().last().html("Cluster "+ (i+1) ).css({"font-weight":"bold"});
                                $('#clusterInnerContainer2').children().last().append("<div></div>").children().last().html("Student "+randomStudent).css({"text-decoration":"underline"});
                            }
                        } 
                    }

                    for(var j=0;j<subjectsArray.length;j++){
                        if(clustersArray[i][j] == 1){
                            if(k<=3){
                                $('#clusterInnerContainer').children().last().append("<div></div>").children().last().html(subjectsArray[j]);
                            }else{

                                if(k==4){
                                    if(i<=1){
                                        $('#clusterInnerContainer1').children().last().append("<div></div>").children().last().html(subjectsArray[j]);
                                    }else{
                                        $('#clusterInnerContainer2').children().last().append("<div></div>").children().last().html(subjectsArray[j]);
                                    }       
                                }else{
                                    if(i<=2){
                                        $('#clusterInnerContainer1').children().last().append("<div></div>").children().last().html(subjectsArray[j]);
                                    }else{
                                        $('#clusterInnerContainer2').children().last().append("<div></div>").children().last().html(subjectsArray[j]);
                                    }   
                                }
                            }
                        }
                    }

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
        subjectCountArray=[];

        for(var i=0;i<subjectsArray.length;i++){
            var count=0;

            for(var j=0;j<data.length;j++){

                if(data[j][ subjectsArray[i] ] == "1"){
                    count=count+1;
                }
            }
            subjectCountArray.push(count);
        }

        console.log(subjectCountArray);

        for(var i=0;i<subjectsArray.length;i++){
            if(i<( (subjectsArray.length)/2 )){
                $("#leftSubjectsList").append("<div></div>").children().last().html(subjectsArray[i] + " - "+ subjectCountArray[i] ).css({"width":"100%","float":"left"});
            }else{
                $("#rightSubjectsList").append("<div></div>").children().last().html(subjectsArray[i] + " - "+ subjectCountArray[i] ).css({"width":"100%","float":"left"});
            }
        }

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

        if(k>3){
            for(var i=0;i<2;i++){
                $('#clusterDescription').append("<div></div>").children().last().attr("id","clusterDescription"+(i+1)).css({"width":"100%","height":"49%","float":"left","border":"2px solid black"});
            }
        }

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

            if(k<=3){
                $('#clusterDescription').append("<div></div>").children().last().attr("id","cluster"+(i+1)).css({"height":"100%","width":(100/k)+"%","float":"left"});
                
                $("#clusterDescription").children().last().append("<div></div>").children().last().html("Cluster: "+(i+1)).css({"font-weight":"bold","margin-bottom":"7px"});
            }else{

                if(k == 4){
                    if(i<= 1){
                        $('#clusterDescription1').append("<div></div>").children().last().attr("id","cluster"+(i+1)).css({"height":"100%","width":(100/(Math.ceil(k/2)))+"%","float":"left"});
                
                        $("#clusterDescription1").children().last().append("<div></div>").children().last().html("Cluster: "+(i+1)).css({"font-weight":"bold","margin-bottom":"7px"});
                    }else{
                        $('#clusterDescription2').append("<div></div>").children().last().attr("id","cluster"+(i+1)).css({"height":"100%","width":(100/(Math.floor(k/2)))+"%","float":"left"});
                
                        $("#clusterDescription2").children().last().append("<div></div>").children().last().html("Cluster: "+(i+1)).css({"font-weight":"bold","margin-bottom":"7px"});
                    }
                }else{
                    if(i<= 2){
                        $('#clusterDescription1').append("<div></div>").children().last().attr("id","cluster"+(i+1)).css({"height":"100%","width":(100/(Math.ceil(k/2)))+"%","float":"left"});
                
                        $("#clusterDescription1").children().last().append("<div></div>").children().last().html("Cluster: "+(i+1)).css({"font-weight":"bold","margin-bottom":"7px"});
                    }else{
                        $('#clusterDescription2').append("<div></div>").children().last().attr("id","cluster"+(i+1)).css({"height":"100%","width":(100/(Math.floor(k/2)))+"%","float":"left"});
                
                        $("#clusterDescription2").children().last().append("<div></div>").children().last().html("Cluster: "+(i+1)).css({"font-weight":"bold","margin-bottom":"7px"});
                    }
                }
            }

            var previousSubject=0;;

            var subjectNumber = $('#subjectNumber').val();

            for(var j=0;j<subjectNumber;j++){   
                var currentSubject = subjectsArray[ clusterSubjectCountArray[i].indexOf( sortedCountArray[i][j] ) ];

                if(currentSubject != previousSubject){
                    if(k<=3){
                        $('#clusterDescription').children().last().append("<div></div>").children().last().html( currentSubject +" - " + clusterSubjectCountArray[i][ subjectsArray.indexOf(currentSubject) ] ).css({"line-height":"1.6"});
                    }else{
                        if(k==4){
                            if(i<=1){
                                $('#clusterDescription1').children().last().append("<div></div>").children().last().html( currentSubject +" - " + clusterSubjectCountArray[i][ subjectsArray.indexOf(currentSubject) ] ).css({"line-height":"1.6"});
                            }else{
                                $('#clusterDescription2').children().last().append("<div></div>").children().last().html( currentSubject +" - " + clusterSubjectCountArray[i][ subjectsArray.indexOf(currentSubject) ] ).css({"line-height":"1.6"});
                            }
                        }else{
                            if(i<=2){
                                $('#clusterDescription1').children().last().append("<div></div>").children().last().html( currentSubject +" - " + clusterSubjectCountArray[i][ subjectsArray.indexOf(currentSubject) ] ).css({"line-height":"1.6"});
                            }else{
                                $('#clusterDescription2').children().last().append("<div></div>").children().last().html( currentSubject +" - " + clusterSubjectCountArray[i][ subjectsArray.indexOf(currentSubject) ] ).css({"line-height":"1.6"});
                            }
                        }
                    }

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

                    if(k<=3){
                        $('#clusterDescription').children().last().append("<div></div>").children().last().html( currentSubject +" - " + clusterSubjectCountArray[i][ subjectsArray.indexOf(currentSubject) ] ).css({"line-height":"1.6"});
                    }else{
                        if(k==4){
                            if(i<=1){
                                $('#clusterDescription1').children().last().append("<div></div>").children().last().html( currentSubject +" - " + clusterSubjectCountArray[i][ subjectsArray.indexOf(currentSubject) ] ).css({"line-height":"1.6"});
                            }else{
                                $('#clusterDescription2').children().last().append("<div></div>").children().last().html( currentSubject +" - " + clusterSubjectCountArray[i][ subjectsArray.indexOf(currentSubject) ] ).css({"line-height":"1.6"});
                            }
                        }else{
                            if(i<=2){
                                $('#clusterDescription1').children().last().append("<div></div>").children().last().html( currentSubject +" - " + clusterSubjectCountArray[i][ subjectsArray.indexOf(currentSubject) ] ).css({"line-height":"1.6"});
                            }else{
                                $('#clusterDescription2').children().last().append("<div></div>").children().last().html( currentSubject +" - " + clusterSubjectCountArray[i][ subjectsArray.indexOf(currentSubject) ] ).css({"line-height":"1.6"});
                            }
                        }
                    }

                    previousSubject= currentSubject;
                }

            }

        }
    }

});

function printBubble(e){
    $('#bubbleInfo').html("");

    var selectedCluster= studentsInClusterArray[e];

    $('#bubbleInfo').append("<div></div>").children().last().html("Cluster "+(e+1)).css({"font-weight":"bold","float":"left","margin-right":"20px"});
    $('#bubbleInfo').append("<div></div>").children().last().html("Total Number: "+ selectedCluster.length).css({"float":"left"});
    $('#bubbleInfo').append("<br>")
    for(var i=0;i<selectedCluster.length;i++){
        
            $('#bubbleInfo').append("<div onClick=printStudent("+selectedCluster[i]+")></div>").children().last().html( (selectedCluster[i]+1) ).css({"height":"10px","margin-right":"10px",
            "margin-bottom":"10px","float":"left"});

    }
    
    if( printedStudentInfo == 0){

        for(var i=1;i<3;i++){
            $('#studentInfo').append("<div></div>").children().last().attr("id","student"+i).css({"height":"99%","width":"150px","border":"2px black solid","float":"left"});
            $("#student"+i).append("<div></div>").children().last().attr("id","student"+i+"Container").css({"height":"78%","width":"98%","border":"2px black solid","margin-bottom":"5px"});
            $('#student'+i).append("<input type='checkbox'>Student "+i+"</input>").children().last().attr("id","checkboxStudent"+i);
        }
        $('#checkboxStudent1').prop("checked",true);
        $('#studentInfo').append("<button>Clear</button>").children().last().attr("id","studentClearButton").css({"width":"50px","height":"20px","float":"left","margin-top":"125px"});

        printedStudentInfo=1;
    }

    $('#checkboxStudent1').click(function(){

        $('#checkboxStudent2').prop("checked",false);
    })
    
    $('#checkboxStudent2').click(function(){
        
        $('#checkboxStudent1').prop("checked",false);
    })

    $('#studentClearButton').click(function(){
        $('#student1Container').html("");
        $('#student2Container').html("");
    })

}

function printStudent(e){
    if( $('#checkboxStudent1').prop("checked") == true ){

        $('#student1Container').html("");
        $('#student1Container').append("<div></div>").children().last().html("Student " +(e+1)).css({"font-weight":"bold","margin-top":"10px"});

        for(var i=0;i<subjectsArray.length;i++){
            if( data[e][ subjectsArray[i] ] == "1"){
                $('#student1Container').append("<div></div>").children().last().html(subjectsArray[i]);
            }
        }
    }else if( $('#checkboxStudent2').prop("checked") == true ){

        $('#student2Container').html("");
        $('#student2Container').append("<div></div>").children().last().html("Student " +(e+1)).css({"font-weight":"bold","margin-top":"10px"});

        for(var i=0;i<subjectsArray.length;i++){
            if( data[e][ subjectsArray[i] ] == "1"){
                $('#student2Container').append("<div></div>").children().last().html(subjectsArray[i]);
            }
        }
    }

}