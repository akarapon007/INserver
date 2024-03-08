// AMovies.ts
export interface AMovies {
    Title: string;
    ReleaseYear: number;
    Genre: string;
    plot: string;
   
}

// APersons.ts
export interface APersons {
    Name: string;
    Birthdate: string;
    Nationality: string;
}

// AStars.ts
export interface AStars {
    Moviename: string;
    Personname: string;
}

// ACreators.ts
export interface ACreators {
    Personname: number;
    Moviename: number;
}
