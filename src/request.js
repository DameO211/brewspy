const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const sortTypeMap = {
    '1': 'name',
    '2': 'type',
    '3': 'address',
    '4': 'city',
    '5': 'state',
    '6': 'postal_code'
};

const sortTypeMapLabel = {
    '1': 'Name',
    '2': 'Type',
    '3': 'Address',
    '4': 'City',
    '5': 'State',
    '6': 'Postal Code'
};

const breweryTypeMap = {
    '1': 'micro',
    '2': 'nano',
    '3': 'regional',
    '4': 'brewpub',
    '5': 'large',
    '6': 'planning',
    '7': 'bar',
    '8': 'contract',
    '9': 'proprietor',
    '10': 'closed'
};

const breweryTypeMapLabel = {
    '1': 'Micro',
    '2': 'Nano',
    '3': 'Regional',
    '4': 'Brewpub',
    '5': 'Large',
    '6': 'Planning',
    '7': 'Bar',
    '8': 'Contract',
    '9': 'Proprietor',
    '10': 'Closed'
};

function buildApiUrl(selectedQuery, userInput, selectedSortTypeMapLabel, selectedSortOrder, perPage) {
    let apiUrl;
    if (selectedQuery === 'by_dist') {
        apiUrl = `https://api.openbrewerydb.org/v1/breweries?${selectedQuery}=${userInput}&per_page=${perPage}`;
    } else {
        apiUrl = `https://api.openbrewerydb.org/v1/breweries?${selectedQuery}=${userInput}&sort=${selectedSortTypeMapLabel}:${selectedSortOrder}&per_page=${perPage}`;
    }
    console.log(apiUrl);
    return apiUrl;
}

function buildSearchApiUrl(selectedQuery, userInput, perPage) {
    const apiUrl = `https://api.openbrewerydb.org/v1/breweries/search?${selectedQuery}=${userInput}&per_page=${perPage}`;
    console.log(apiUrl);
    return apiUrl;
}

function makeApiRequest(url) {
    axios.get(url)
        .then(response => {
            console.log('Response data:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            rl.close();
        });
}

function askPerPage(selectedQuery, selectedType, selectedSortType, selectedSort) {
    rl.question('Enter the number of results per page: ', perPage => {
        const apiUrl = buildApiUrl(selectedQuery, selectedType, selectedSortType, selectedSort, perPage);
        makeApiRequest(apiUrl);
    });
}

function askSort(selectedQuery, selectedType) {
    console.log('Sorting Options:');
    Object.keys(sortTypeMapLabel).forEach(key => {
        console.log(`${key}. ${sortTypeMapLabel[key]}`);
    });

    rl.question(`Select sorting field for ${selectedType}:\nChoice: `, sortChoice => {
        const selectedSortTypeFromMap = sortTypeMap[sortChoice];
        if (selectedSortTypeFromMap) {
            rl.question(`Select sorting order for ${selectedType}:\n1. Ascending\n2. Descending\nChoice: `, sortOrderChoice => {
                const sortMap = {
                    '1': 'asc',
                    '2': 'desc'
                };
                const selectedSortOrder = sortMap[sortOrderChoice];
                if (selectedSortOrder) {
                    askPerPage(selectedQuery, selectedType, selectedSortTypeFromMap, selectedSortOrder);
                } else {
                    console.log('Invalid choice.');
                    askSort(selectedQuery, selectedType);
                }
            });
        } else {
            console.log('Invalid choice.');
            askSort(selectedQuery, selectedType);
        }
    });
}

function askType(selectedQuery) {
    console.log('Brewery Type Menu:');
    Object.keys(breweryTypeMapLabel).forEach(key => {
        console.log(`${key}. ${breweryTypeMapLabel[key]}`);
    });

    rl.question('Select a brewery type:\nChoice: ', typeChoice => {
        const selectedType = breweryTypeMap[typeChoice];
        if (selectedType) {
            askSort(selectedQuery, selectedType);
        } else {
            console.log('Invalid choice.');
            askType(selectedQuery);
        }
    });
}

function askCity() {
    rl.question('Enter a city: ', city => {
        askSort('by_city', city);
    });
}

function askState() {
    rl.question('Enter a state: ', state => {
        askSort('by_state', state);
    });
}

function askLocation() {
    rl.question('Enter your location: ', location => {
        askPerPage('by_dist', location);
    });
}

function askName() {
    rl.question('Enter a brewery name: ', name => {
        askSort('by_name', name);
    });
}

function askPostal() {
    rl.question('Enter a zipcode: ', postal => {
        askSort('by_postal', postal);
    });
}

function askSearch() {
    rl.question('Enter a search: ', userInput => {
        rl.question('Enter the number of results per page: ', perPage => {
            const apiUrl = buildSearchApiUrl('query', userInput, perPage);
            makeApiRequest(apiUrl);
        });
    });
}

function startMenu() {
    showSearchQueryMenu();
    rl.question('Select a search query: ', choice => {
        switch (choice) {
            case '1':
                askCity();
                break;
            case '2':
                askState();
                break;
            case '3':
                askLocation();
                break;
            case '4':
                askName();
                break;
            case '5':
                askPostal();
                break;
            case '6':
                askType('by_type');
                break;
            case '7':
                askSearch();
                break;
            default:
                console.log('Invalid choice.');
                startMenu();
        }
    });
}

function showSearchQueryMenu() {
    console.log('Search Query Menu:');
    console.log('1. by_city');
    console.log('2. by_state');
    console.log('3. by_dist');
    console.log('4. by_name');
    console.log('5. by_postal');
    console.log('6. by_type');
    console.log('7. search');
}

startMenu();

