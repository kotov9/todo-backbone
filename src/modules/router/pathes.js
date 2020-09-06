module.exports = {
    'missions':     (() => 'missions/')(),
    'mission':      ((id) => `missions/${id}`)(id),
}