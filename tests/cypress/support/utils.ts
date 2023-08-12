import { UserPushOptions } from 'notivue'

export function parseText(subject: any) {
   return JSON.parse(subject.text()) as Record<string, any>
}

export const RESOLVE_REJECT_DELAY = 2000

/**
 * Delay called before clearing, destroying or updating
 * some Notivue tests notifications.
 *
 * Needed just to see the change in the UI
 */
export const GENERIC_UPDATE_DELAY = 1000

export const SWIPE_NOTIFICATION_WIDTH = 300

export const DEFAULT_ENTER_LEAVE_ANIM_DURATION = 300

export function getRandomInt(min: number, max: number) {
   return Math.floor(Math.random() * (max - min + 1)) + min
}

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
   } as UserPushOptions
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
