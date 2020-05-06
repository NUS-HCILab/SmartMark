/**
 * @param {number} alpha a first angle (in degrees)
 * @param {number} beta a second angle (in degrees)
 * @return {number} The (signed) delta between the two angles (in degrees).
 */
export const deltaAngle = (alpha, beta) => mod(beta - alpha + 180, 360) - 180;
