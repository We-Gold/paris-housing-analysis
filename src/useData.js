import { useState, useEffect } from 'react'
import { csv } from 'd3'

const csvUrl = "/data/ParisHousingClass.csv"

export const useData = () => {
    const [data, setData] = useState()

    useEffect(() => {
        csv(csvUrl).then(data => setData(formatData(data)))
    }, [])

    return data
}

const formatData = (data) => {
    const formattedData = data.map((row) => ({
        attic: +row.attic,
        basement: +row.basement,
        category: row.category == "Basic" ? 0 : 1,
        cityCode: +row.cityCode,
        cityPartRange: +row.cityPartRange,
        floors: +row.floors,
        garage: +row.garage,
        hasGuestRoom: +row.hasGuestRoom,
        hasPool: +row.hasPool,
        hasStorageRoom: +row.hasStorageRoom,
        hasStormProtector: +row.hasStormProtector,
        hasYard: +row.hasYard,
        isNewBuilt: +row.isNewBuilt,
        made: +row.made,
        numPrevOwners: +row.numPrevOwners,
        numberOfRooms: +row.numberOfRooms,
        price: +row.price,
        squareMeters: +row.squareMeters
    }))

    formattedData.columns = data.columns

    return formattedData
}