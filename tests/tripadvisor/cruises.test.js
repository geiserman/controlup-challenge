const {
    getCruiseLocations,
    searchCruisesByDestinationId,
} = require('../../src/services/tripadvisor-cruises-service');
const { MARKERS } = require('../../src/helpers/test-run-helpers/constants');
const { getLogger } = require('../../src/init/initialize-logger');

const logger = getLogger();
const filterTerm = 'Caribbean';

describe(`TripAdvisor Cruises ${MARKERS.PROGRESSION}`, () => {
    it('Able to fetch all cruises to Caribbean destination', async () => {
        const allCruisesLocations = await getCruiseLocations();

        const caribbeanLocations = allCruisesLocations.filter((cr) => cr.name === filterTerm);

        expect(caribbeanLocations.length).toBeGreaterThan(0);

        const caribbeanDestinationId = caribbeanLocations.find((cr) => cr.destinationId)
            ?.destinationId;

        expect(caribbeanDestinationId).toBeDefined();

        const allCaribbeanCruises = await searchCruisesByDestinationId({
            destinationId: caribbeanDestinationId,
        });

        const vessels = allCaribbeanCruises.list;

        expect(vessels.length).toBeGreaterThan(0);
        vessels.sort((a, b) => b.ship.crew - a.ship.crew);

        vessels.forEach((vessel) => {
            logger.debug(
                `Ship Name: ${vessel.ship.name}, Ship id: ${vessel.ship.id}, Crew Number: ${vessel.ship.crew}`,
            );
        });

        expect(vessels.length).toBeGreaterThan(0);
    });
});
