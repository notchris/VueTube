var app = new Vue({
    el: '#app',
    data: {
    	results: false,
    	player: false,
    	done: false,
        search: '',
        playlist: []
    },
    watch: {
        search: _.debounce(
          function () {
            if (this.search !== ''){
                Vue.http.post('/search/',{term: app.$refs.search.value},{emulateJSON:true}).then(function(response){
                    app.results = [];
                    response.body.forEach(function(r){
                        if (r.kind == "youtube#video"){
                            app.results.push({
                                title: r.title,
                                id: r.id,
                                thumb: r.thumbnails.high.url
                            })
                        }
                    })
                })
            } else{
                app.results = false;
              return;
            }
          },500)
    },
    methods: {
    	loadVideo: function(id,title){
            if (title){
                this.playlist.push({
                    id: id,
                    title: title
                })
            }
    		if (!this.player){
    			app.init(id);
    		} else{
    			this.player.loadVideoById(id, 5, "large")
    		}
            app.results = false;
    	},
    	stopVideo: function(){
    		this.player.stopVideo();
    	},
    	onPlayerStateChange: function(event){
		    if (event.data == YT.PlayerState.PLAYING && !this.done) {
		      //setTimeout(this.stopVideo, 6000);
		      this.done = true;
		    }
    	},
    	onPlayerReady: function(event){
    		event.target.playVideo();
    	},
    	init: function(id){
		    this.player = new YT.Player('player', {
		      height: '390',
		      width: '640',
              playerVars: {
                color: 'white'
              },
		      videoId: id,
		      events: {
		        'onReady': this.onPlayerReady,
		        'onStateChange': this.onPlayerStateChange
		      }
		    });
    	}
    }
});

document.addEventListener('click',function(event){
    app.results = false;
})