package main

import (
	"backend/config"
	"backend/model/entity"
	"backend/route"
)

func init() {
	config.InitEnvironment()
	config.InitializeDBConnection()
	config.MakeFolder("Resource")
}

func main() {
	db := config.GetDatabaseInstance()
	db.AutoMigrate(&entity.StockIPO{}, &entity.Broker{}, &entity.IPO_Detail{}, &entity.Stock{}, &entity.Category{}, &entity.Link{})
	router := route.SetupRouter()
	router.Run(":8080")
}
