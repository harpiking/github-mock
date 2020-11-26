let dropNow = document.querySelector(".navdown");
let dropped = document .querySelector(".dropProfile");
let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

function openNow(){
  if(vw <= 768 && dropNow.style.display === "none"){
    dropNow.style.display = "block";
  }
  else{
    dropNow.style.display = "none";
  }
}

function visibility() {
   if (dropped.style.display === "none") {
       dropped.style.display = "block";
   } else {
       dropped.style.display = "none";
   }
}
let showList = document.getElementById("profileRepository");
function showNow() {
   if (showList.style.display === "none") {
       showList.style.display = "block";
   } else {
       showList.style.display = "none";
   }
}

function userDetails({avatarUrl, name, login, bio, status}) {
   let profileDetail = document.querySelectorAll(".prof-content");
   profileDetail = Array.from(profileDetail);

   profileDetail.forEach(
       (e) =>
           (e.innerHTML += `
            <div class="first">
                       <div class="proIm">
                           <img class="profile" src="${avatarUrl}" alt="profile-picture">
                       </div>

                       <div class="name">
                           <h3 class="nameH">${name}</h3>
                           <p class="nameP" style="color: #6a737d;">${login}</p>
                           <p class="nameP" style="margin-top: 10px">${bio}</p>
                       </div>
                   </div>

                   <div class="emoji-name">
                       <div class="emoji">
                           <p class="eText"><i class="far fa-smile smile"></i> <big class="emo">Set status </big></p>
                       </div>
                   </div>
`)
   );
}

function repoData({
                        name,
                        isPrivate,
                        updatedAt,
                        stargazerCount,
                        forkCount,
                        description,
                        url,
                        languages
                    }
) {
   let repoContainer = document.querySelector('.prof-con');
   repoContainer.innerHTML += `
               <div class="contentP">
                   <div class="left-pro">
                       <h3 href="${url}">${name}</h3>
                       <div class="repo-info">
                       <span class="co" style="background-color: ${languages?.nodes[0].color}"></span>
                       <small class="small" style="margin-left: 2px">${languages?.nodes[0].name}</small>
                       <small class="small" style="margin-left: 15px">Updated on ${dateConverter(updatedAt)}</small>
</div>
                   </div>
                   <div class="right">
                       <button class="btn btn-sm" type="button" name="button"><i class="far fa-star"></i> Star</button>
                       <br>
                   </div>
               </div>

`
}

function dateConverter(date) {
   const d = new Date(date);
   const mo = new Intl.DateTimeFormat("en", {month: "short"}).format(d);
   const da = new Intl.DateTimeFormat("en", {day: "2-digit"}).format(d);

   return `${da} ${mo}`;
}

fetch("https://api.github.com/graphql", {
   method: "POST",
   mode: "cors",
   cache: "no-cache",
   referrerPolicy: "no-referrer",
   headers: {
       "Content-Type": "application/json",
       authorization: "token dbe6a5905b61c4630eaa31f6097ab9df3a490b74",
   },
   body: JSON.stringify({
       query: `
 {
   viewer {
     login
     avatarUrl
     name
     bio
     status {
       emojiHTML
       message
       __typename
     }
     repositories(last: 20, isFork: false) {
       nodes {
         name
         description
         url
         stargazerCount
         updatedAt
         forkCount
         isPrivate
         languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
           nodes {
             color
             name
             __typename
           }
           __typename
         }
         __typename
       }
       __typename
     }
     __typename
   }
 }
 `,
   }),
})
   .then((res) => {
       return res.json();
   })
   .then(({data}) => {
       const {viewer} = data;
       userDetails(viewer);
       [...viewer.repositories.nodes].reverse().forEach((repo) => {
           repoData(repo);
       });
   });
