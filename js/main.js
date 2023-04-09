'use strict'
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const nodeListThumbnails = $$('.movie__thumbnail-img')
const movieContentList = $('.movies__content-list-movies')
const moviesList = $('.movies__content-list-movies')
const dotsList = $$('.movie__content-thumbnail-dot')
const searchInput = $('.personnel input')
const suggestList = $('.personnel .suggest')
const homeType = $('#home')
const seriesType = $('#series')
const moviesType = $('#movies')
const kidsType = $('#kids')



const web = {
    currentIndex: 0,
    handleEvents: function () {
        // handle slide event
        const nextBtn = $('.btn-next')
        const prevBtn = $('.btn-prev')

        nextBtn.onclick = this.nextThumbnail.bind(this);
        prevBtn.onclick = this.prevThumbnail.bind(this);

        const arrDots = Array.from(dotsList).forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.removeDot();
                this.hideThumbnail();
                this.currentIndex = index;
                dot.classList.add('active');
                nodeListThumbnails[index].classList.remove('hide')
                nodeListThumbnails[index].style.animation = 'show ease-in 0.5s';
            })
        })

        
        //handel scroll movies list button
        const scrollNextButton = $('.movies-card-btn-right');
        const scrollPrevButton = $('.movies-card-btn-left');

        scrollNextButton.onclick = () => {
            movieContentList.scrollLeft += 150;
        }
        scrollPrevButton.onclick = () => {
            movieContentList.scrollLeft -= 150;
        }

        // search function 
        searchInput.addEventListener('input', (e) => {
            const listNameMovie = $$('.movie-name a')
            const arrNameList = Array.from(listNameMovie).forEach(name => {
                let text = name.innerText.toLowerCase()
                let value = e.target.value.toLowerCase()
                if(value === '') {
                    name.parentElement.style.display = 'none'
                } else {
                    if(text.includes(value)) {
                    name.parentElement.style.display = 'block'
                } else {
                    name.parentElement.style.display = 'none'
                    }
                }
            })
        })
        
        // render list movies of type
        homeType.onclick = (e) => {
            this.render()
        }

        seriesType.onclick = (e) => {
            this.renderTypeOfListMovies(e.target.textContent.toLowerCase())
        }

        moviesType.onclick = (e) => {
            this.renderTypeOfListMovies(e.target.textContent.replace(/s/g,'').toLowerCase())
        }

        kidsType.onclick = (e) => {
            this.renderTypeOfListMovies(e.target.textContent.replace(/s/g,'').toLowerCase())
        }

    },
    render: function() {
        const Api = 'http://localhost:3000/movie'
        fetch(Api)
            .then(response => response.json())
            .then(movies => {
                let htmls = movies.map(movie => {
                    return `
                    <div class="movies__content-list-movies-card">
                        <img src="${movie.sposter}" alt="" class="movies__content-list-movies-poster">
                        <div class="movies__content-list-movies-rest-card">
                            <img src="${movie.bposter}" alt="">
                            <button class="movies-rest-card__btn-watch">
                                <a href="">Watch <i class="fa-solid fa-play"></i></a>
                            </button>
                            <div class="movies__content-list-movies-rest-card-des">
                                <h4>${movie.name}</h4>
                                <div class="movies-rest-card-des__score">
                                    <p>${movie.genre}, ${movie.date}</p>
                                    <h3><span>IMDB</span><i class="fa-solid fa-star"></i>${movie.imdb}</h3>
                                </div>
                            </div>
                        </div>
                    </div>` 
                })
                moviesList.innerHTML = htmls.join('');
            })
    },
    renderTypeOfListMovies: function (moviesType) {
        const Api = 'http://localhost:3000/movie'
        fetch(Api)
            .then(response => response.json())
            .then(movies => {
                const typeMovies = movies.filter(movie => movie.type === moviesType)
                const htmls = typeMovies.map(movie =>{
                    return `
                    <div class="movies__content-list-movies-card">
                        <img src="${movie.sposter}" alt="" class="movies__content-list-movies-poster">
                        <div class="movies__content-list-movies-rest-card">
                            <img src="${movie.bposter}" alt="">
                            <button class="movies-rest-card__btn-watch">
                                <a href="">Watch <i class="fa-solid fa-play"></i></a>
                            </button>
                            <div class="movies__content-list-movies-rest-card-des">
                                <h4>${movie.name}</h4>
                                <div class="movies-rest-card-des__score">
                                    <p>${movie.genre}, ${movie.date}</p>
                                    <h3><span>IMDB</span><i class="fa-solid fa-star"></i>${movie.imdb}</h3>
                                </div>
                            </div>
                        </div>
                    </div>` 
                })
                moviesList.innerHTML = htmls.join('');
            })
    },
    showThumbnail: function () {
        dotsList[this.currentIndex].classList.add('active');
        nodeListThumbnails[this.currentIndex].classList.remove('hide')
        nodeListThumbnails[this.currentIndex].style.animation = 'show ease-in 0.5s';

    },
    nextThumbnail: function () {
        dotsList[this.currentIndex].classList.remove('active');
        nodeListThumbnails[this.currentIndex].classList.add('hide')
        this.currentIndex++;
        if(this.currentIndex >= nodeListThumbnails.length) {
            this.currentIndex = 0;
        }
        this.showThumbnail();
    },
    prevThumbnail: function () {
        dotsList[this.currentIndex].classList.remove('active');
        nodeListThumbnails[this.currentIndex].classList.add('hide')
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = nodeListThumbnails.length - 1;
        }
        this.showThumbnail();
    },
    removeDot: function () {
        const arrDot = Array.from(dotsList).forEach((dot) => {
            if(dot.classList.contains('active')) {
                dot.classList.remove('active');
            }
        })
    },
    hideThumbnail: function () {
        const arrThumb = Array.from(nodeListThumbnails).forEach((thumb) => {
            if(!thumb.classList.contains('hide')) {
                thumb.classList.add('hide');
            }
        })
    },
    renderSearchList: function() {
        const Api = 'http://localhost:3000/movie'
        fetch(Api)
            .then(response => response.json())
            .then(movies => {
                const movieNames = movies.map(movie => {
                    return `<li class="movie-name" ><a href="">${movie.name}</a></li>`
                })
                suggestList.innerHTML = movieNames.join('')              
            })
    },
    start: function () {
        this.render();
        this.renderSearchList();
        this.handleEvents();
        this.showThumbnail();
    }
}

web.start();