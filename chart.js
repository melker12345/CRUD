    const rawData = JSON.parse(localStorage.getItem('rawData') || '{}');

        function getMostCommonDomain(data) {
            const domainCounts = data.reduce((acc, user) => {
                
                const domain = user.email.split('@')[1];

                acc[domain] = (acc[domain] || 0) + 1; // acc is the accumulator and it is set to an object with the domain as the key and the count as the value
                return acc;
            }); 
            
            // the domainCounts function works by taking the data array and reducing it to an object with the domain as the key and the count as the value
            let maxCount = 0;
            let mostCommonDomain = '';

            for (const domain in domainCounts) {
                if (domainCounts[domain] > maxCount) {
                    maxCount = domainCounts[domain];
                    mostCommonDomain = domain;
                }
            }

            return { mostCommonDomain, count: maxCount };
        }

        const userCount = Array.isArray(rawData.data) ? rawData.data.length : 0;
        const { mostCommonDomain, count } = getMostCommonDomain(rawData.data || []); // the || [] is a fallback in case rawData.data is undefined

        function renderUserChart() {
            const ctx = document.getElementById("userChart").getContext("2d");

            const chart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: [
                        "Local storage",
                        "Email Domain",
                    ],
                    
                    
                    datasets: [
                        {
                            label: "Users",
                            data: [userCount, count],
                            backgroundColor: ["#36a2eb", "#107c42"],
                            
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                color: "#000",
                                font:{
                                    size: 14,
                                },
                            },
                            grid: {
                                display: false,
                                color: "#000",
                                
                            },
                            title: {
                                display: true,
                                font:{
                                    size: 14,
                                },
                                text: "Number of Users",
                                color: "#000", 
                            },
                            max: userCount +2,
                        },
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    if (context.dataIndex === 1) {
                                        return mostCommonDomain + ": " + context.raw;
                                    }
                                    return context.dataset.label + ": " + context.raw;
                                }, // this function is used to display the domain name in the tooltip
                            },
                        },
                    },
                },
            });
        }

        renderUserChart();