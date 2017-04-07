var repos ;
$(document).ready(function(){
	$("#search").show().siblings().hide();
});

$("#search-repo").on("click", function(){
	if($("#search-box-input").val()){
  	repos = [];
	var url ="https://api.github.com/search/repositories?q="+$("#search-box-input").val().split(" ").join("+");	
  	$.get( url, function( data ) {
  	  if(data['items']){
  		  repos = data['items'].map(function(item){
  			  return {
  				  description : item.description,
  				  name : item.name,
  				  star_count : item.stargazers_count,
  				  open_issue : item.open_issues,
  				  author : item.owner.login
  			  }
  		  });
  	  }
  	}  
  	).done(function(){
  		if(repos.length){
  			$("#repo-list").empty();
  			repos.forEach(function (repo, index){
				 $("#repo-list").append('<div class= "list-group-item list-group-item-action" onclick=getRepoIssue('+index+")>" +
				 							"<div >" +
				 								"<label>"+repo.name+"</label>"+
				 								"<label class=repo-description>"+repo.description+"<label>" +
				 							"</div>" +
				 							'<div style="width : 100%">' +
				 								"<small>Star: "+repo.star_count+ "</small> "+
				 							"</div>" +
				 						"</div>"); 				
  			});
  			
  		}else{
  			$("#repo-list").append("<h2>No Repository found for "+$("#search-box-input").val()+" </h2>");
  		}
  		$("#repo-list-container").show().siblings().hide();
  	});
  }else{
  	alert('not found');
  }
  
});

$("#search_back").on("click", function(){
	$("#search").show().siblings().hide();
	$("#search-box-input").val("");
});

function getRepoIssue(repo_index){
	
	var repo = repos[repo_index];
	var issue_list = new Array();
	console.log(repo);
	var issue_url ="http://api.github.com/repos/"+repo.author+"/"+repo.name+"/issues";
	$.get(issue_url, function (issues){
		issue_list = issues.map(function(issue){
			return {
				title : issue.title,
				state : issue.state,
			}
		});
	}).done(function (){
		if(issue_list.length>0){
			$("#repo-name h1").text(repo.name);
			$("#repo-owner h3").text(repo.author);
			$("#repo-issue-list").show().siblings().hide();
			$("#issue_list").empty();
			issue_list.forEach(function(issue){
				if(issue.state==="open"){
					$("#issue_list").append('<div class="input-group move-down"><span class="input-group-addon right-move"><input type=checkbox /></span>'+issue.title+"</div>");
				}else{
					$("#issue_list").append('<div><span class="input-group-addon"><input type=checkbox checked/> </span>'+issue.title+"</div>");
				}
			});
		}else{
			$("#issue_list").append("<h2>No issue generated for this repositories.</h2>");
		}
		$("#repo-issue-list").show().siblings().hide();
	});
}

$("#repo_list").on("click", function(){
	$("#repo-list-container").show().siblings().hide();
});