export function parseText(subject: any) {
   return JSON.parse(subject.text()) as Record<string, any>
}

export const RESOLVE_REJECT_DELAY = 1000

function randomId() {
   return Math.random().toString(36).substr(2, 9)
}

export function getRandomOptions() {
   return {
      title: randomId(),
      message: randomId(),
      duration: Math.floor(Math.random() * 10000),
      ariaLive: randomId(),
      ariaRole: randomId(),
      closeAriaLabel: randomId(),
   }
}

export const randomProps = {
   name: 'John',
   age: 30,
   married: true,
   address: {
      street: '123 Main St',
      city: 'New York',
      country: 'USA',
   },
   job: 'Software Engineer',
   salary: 5000,
   skills: {
      frontend: 'JavaScript',
      backend: 'Node.js',
      database: 'MongoDB',
   },
}

export const randomProps2 = {
   projects: 8,
   education: "Bachelor's Degree",
   experience: {
      years: 7,
      previousCompany: 'ABC Inc',
      position: 'Senior Developer',
   },
   languages: ['English', 'Spanish'],
   hobbies: {
      hobby1: 'Reading',
      hobby2: 'Cooking',
      hobby3: 'Playing Guitar',
   },
   favoriteNumber: 13,
   favoriteColor: 'Blue',
   hasPets: true,
   petNames: ['Max', 'Bella'],
   friends: {
      friend1: 'Sarah',
      friend2: 'Michael',
      friend3: 'Emily',
   },
   isStudent: false,
   school: 'University of XYZ',
}
