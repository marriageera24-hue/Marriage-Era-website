package main

import (
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

func migrate() {
	db.AutoMigrate(&User{}, &Session{}, &UserInterest{}, &Media{})

	db.AutoMigrate(&SMS{})
	db.AutoMigrate(&Notification{})
}
