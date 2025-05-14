/*
 ----------------------------------------------------------------------------
 Developer: Ismail Hamzah
 Email: go2ismail@gmail.com
 ----------------------------------------------------------------------------
*/

import { createApp, reactive, ref, onMounted, nextTick } from 'vue'
import { useAccessManager } from 'useAccessManager'
import { useAxios } from 'useAxios'
import indoloading from 'indoloading'
import indocontentloading from 'indocontentloading'

const app = createApp({
    components: {
        indoloading,
        indocontentloading
    },
    setup() {
        const { checkPageAccess } = useAccessManager()
        const { request } = useAxios()
        const vendorContacts = ref([])
        const customerContacts = ref([])
        const vendors = ref([])
        const customers = ref([])
        const pageLoading = ref(true)
        const barChartVendor = ref(null)
        const barChartCustomer = ref(null)
        const pieChart = ref(null)
        const ringChart = ref(null)
        const gaugeChartVendor = ref(null)
        const gaugeChartCustomer = ref(null)

        // Modern color palette
        const colorPalette = [
            '#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6',
            '#1abc9c', '#f1c40f', '#e67e22', '#34495e', '#16a085',
            '#d35400', '#c0392b', '#8e44ad', '#27ae60', '#2980b9'
        ]

        const drawBarChartCustomer = async () => {
            const myChart = echarts.init(barChartCustomer.value)

            const seriesData = customers.value.map((customer, index) => {
                const count = customerContacts.value.filter(contact => contact.customerName === customer).length
                return {
                    value: count,
                    itemStyle: {
                        color: colorPalette[index % colorPalette.length],
                        borderRadius: [4, 4, 0, 0]
                    }
                }
            })

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: '#f1f1f1',
                    borderWidth: 1,
                    textStyle: {
                        color: '#333'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '15%',
                    top: '5%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: customers.value,
                    axisLabel: {
                        rotate: 45, 
                        interval: 0,
                        color: '#666',
                        fontSize: 11
                    },
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#eee'
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                },
                series: [
                    {
                        name: 'Contacts',
                        type: 'bar',
                        data: seriesData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0,0,0,0.3)'
                            }
                        },
                        barWidth: '60%'
                    }
                ]
            }
            myChart.setOption(option)
            window.addEventListener('resize', () => myChart.resize())
        }
        
        const drawBarChartVendor = async () => {
            const myChart = echarts.init(barChartVendor.value)

            const seriesData = vendors.value.map((vendor, index) => {
                const count = vendorContacts.value.filter(contact => contact.vendorName === vendor).length
                return {
                    value: count,
                    itemStyle: {
                        color: colorPalette[index % colorPalette.length],
                        borderRadius: [0, 4, 4, 0]
                    }
                }
            })

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: '#f1f1f1',
                    borderWidth: 1,
                    textStyle: {
                        color: '#333'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#eee'
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'category',
                    data: vendors.value,
                    axisLabel: {
                        color: '#666',
                        fontSize: 11
                    },
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    }
                },
                series: [
                    {
                        name: 'Contacts',
                        type: 'bar',
                        data: seriesData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0,0,0,0.3)'
                            }
                        },
                        barWidth: '60%'
                    }
                ]
            }
            myChart.setOption(option)
            window.addEventListener('resize', () => myChart.resize())
        }
        
        const drawPieChart = async () => {
            const myChart = echarts.init(pieChart.value)

            const customerContactCounts = customerContacts.value.reduce((acc, contact) => {
                const customerName = contact.customerName
                if (acc[customerName]) {
                    acc[customerName] += 1
                } else {
                    acc[customerName] = 1
                }
                return acc
            }, {})

            const pieData = Object.keys(customerContactCounts).map((customerName, index) => {
                return {
                    value: customerContactCounts[customerName],
                    name: customerName,
                    itemStyle: {
                        color: colorPalette[index % colorPalette.length]
                    }
                }
            })

            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: '#f1f1f1',
                    borderWidth: 1,
                    textStyle: {
                        color: '#333'
                    }
                },
                legend: {
                    orient: 'vertical',
                    right: 10,
                    top: 'center',
                    type: 'scroll',
                    textStyle: {
                        fontSize: 12,
                        color: '#666'
                    }
                },
                series: [
                    {
                        name: 'Customer Contacts',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        center: ['40%', '50%'],
                        avoidLabelOverlap: true,
                        itemStyle: {
                            borderRadius: 4,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '12',
                                fontWeight: 'bold'
                            },
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: pieData
                    }
                ]
            }
            myChart.setOption(option)
            window.addEventListener('resize', () => myChart.resize())
        }
        
        const drawRingChart = async () => {
            const myChart = echarts.init(ringChart.value)

            const vendorContactCounts = vendorContacts.value.reduce((acc, contact) => {
                const vendorName = contact.vendorName
                if (acc[vendorName]) {
                    acc[vendorName] += 1
                } else {
                    acc[vendorName] = 1
                }
                return acc
            }, {})

            const pieData = Object.keys(vendorContactCounts).map((vendorName, index) => {
                return {
                    value: vendorContactCounts[vendorName],
                    name: vendorName,
                    itemStyle: {
                        color: colorPalette[index % colorPalette.length]
                    }
                }
            })

            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: '#f1f1f1',
                    borderWidth: 1,
                    textStyle: {
                        color: '#333'
                    }
                },
                legend: {
                    orient: 'vertical',
                    left: 10,
                    top: 'center',
                    type: 'scroll',
                    textStyle: {
                        fontSize: 12,
                        color: '#666'
                    }
                },
                series: [
                    {
                        name: 'Vendor Contacts',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        center: ['60%', '50%'],
                        avoidLabelOverlap: true,
                        itemStyle: {
                            borderRadius: 4,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '12',
                                fontWeight: 'bold'
                            },
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: pieData
                    }
                ]
            }
            myChart.setOption(option)
            window.addEventListener('resize', () => myChart.resize())
        }
        
        const drawGaugeChartVendor = async () => {
            const myChart = echarts.init(gaugeChartVendor.value)

            const totalVendorContacts = vendorContacts.value.length
            const totalCustomerContacts = customerContacts.value.length
            const totalContacts = totalVendorContacts + totalCustomerContacts

            const vendorPercentage = totalContacts > 0 ? (totalVendorContacts / totalContacts) * 100 : 0

            const option = {
                tooltip: {
                    formatter: '{a} <br/>{b}: {c}%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: '#f1f1f1',
                    borderWidth: 1,
                    textStyle: {
                        color: '#333'
                    }
                },
                series: [
                    {
                        name: 'Contact Distribution',
                        type: 'gauge',
                        radius: '85%',
                        center: ['50%', '60%'],
                        startAngle: 180,
                        endAngle: 0,
                        min: 0,
                        max: 100,
                        splitNumber: 10,
                        axisLine: {
                            lineStyle: {
                                width: 20,
                                color: [
                                    [0.3, '#f39c12'],
                                    [0.7, '#1abc9c'],
                                    [1, '#3498db']
                                ]
                            }
                        },
                        pointer: {
                            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                            length: '60%',
                            width: 8,
                            offsetCenter: [0, '10%'],
                            itemStyle: {
                                color: '#34495e'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            length: 20,
                            lineStyle: {
                                width: 2,
                                color: '#ddd'
                            }
                        },
                        axisLabel: {
                            distance: -30,
                            color: '#666',
                            fontSize: 10
                        },
                        title: {
                            offsetCenter: [0, '-20%'],
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#2c3e50'
                        },
                        detail: {
                            offsetCenter: [0, '40%'],
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: '#34495e',
                            formatter: '{value}%',
                            show: true
                        },
                        data: [{ value: parseFloat(vendorPercentage.toFixed(2)), name: 'Vendor Contacts' }]
                    }
                ]
            }
            myChart.setOption(option)
            window.addEventListener('resize', () => myChart.resize())
        }

        const drawGaugeChartCustomer = async () => {
            const myChart = echarts.init(gaugeChartCustomer.value)

            const totalVendorContacts = vendorContacts.value.length
            const totalCustomerContacts = customerContacts.value.length
            const totalContacts = totalVendorContacts + totalCustomerContacts

            const customerPercentage = totalContacts > 0 ? (totalCustomerContacts / totalContacts) * 100 : 0

            const option = {
                tooltip: {
                    formatter: '{a} <br/>{b}: {c}%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: '#f1f1f1',
                    borderWidth: 1,
                    textStyle: {
                        color: '#333'
                    }
                },
                series: [
                    {
                        name: 'Contact Distribution',
                        type: 'gauge',
                        radius: '85%',
                        center: ['50%', '60%'],
                        startAngle: 180,
                        endAngle: 0,
                        min: 0,
                        max: 100,
                        splitNumber: 10,
                        axisLine: {
                            lineStyle: {
                                width: 20,
                                color: [
                                    [0.3, '#e74c3c'],
                                    [0.7, '#f39c12'],
                                    [1, '#2ecc71']
                                ]
                            }
                        },
                        pointer: {
                            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                            length: '60%',
                            width: 8,
                            offsetCenter: [0, '10%'],
                            itemStyle: {
                                color: '#34495e'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            length: 20,
                            lineStyle: {
                                width: 2,
                                color: '#ddd'
                            }
                        },
                        axisLabel: {
                            distance: -30,
                            color: '#666',
                            fontSize: 10
                        },
                        title: {
                            offsetCenter: [0, '-20%'],
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#2c3e50'
                        },
                        detail: {
                            offsetCenter: [0, '40%'],
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: '#34495e',
                            formatter: '{value}%',
                            show: true
                        },
                        data: [{ value: parseFloat(customerPercentage.toFixed(2)), name: 'Customer Contacts' }]
                    }
                ]
            }
            myChart.setOption(option)
            window.addEventListener('resize', () => myChart.resize())
        }

        onMounted(async () => {
            await checkPageAccess()
            setTimeout(async () => {
                try {
                    const response = await request('get', '/Dashboard/GetDashboardMain', {})

                    if (response) {
                        customerContacts.value = response?.data?.content?.data?.customerContacts ?? []
                        vendorContacts.value = response?.data?.content?.data?.vendorContacts ?? []

                        customers.value = Array.from(new Set(customerContacts.value.filter(item => item?.customerName).map(item => item.customerName)))
                        vendors.value = Array.from(new Set(vendorContacts.value.filter(item => item?.vendorName).map(item => item.vendorName)))
                    }
                } catch (error) {
                    console.error('Error during API call:', error);
                } finally {
                    pageLoading.value = false

                    await nextTick()
                    await drawBarChartCustomer()
                    await drawBarChartVendor()
                    await drawPieChart()
                    await drawRingChart()
                    await drawGaugeChartVendor()
                    await drawGaugeChartCustomer()
                }
            }, 1000)

        })
        return {
            pageLoading,
            vendorContacts,
            customerContacts,
            vendors,
            customers,
            barChartVendor,
            barChartCustomer,
            pieChart,
            ringChart,
            gaugeChartVendor,
            gaugeChartCustomer
        }
    }
})


app.config.errorHandler = (err, instance, info) => {
    console.error('Error:', err)
    Swal.fire({
        title: 'Error!',
        text: `Error: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'Ok',
        allowOutsideClick: false
    })
}
app.mount('#app')