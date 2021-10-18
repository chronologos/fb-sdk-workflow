package main

import (
	"context"
	"fmt"
	"log"
	"net/http/httptrace"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"google.golang.org/api/iterator"
)

func main() {
	// os.Setenv("GOOGLE_CLOUD_PROJECT", "ian-firebase-auth-sdk")
	ctx := context.Background()
	trace := &httptrace.ClientTrace{
		DNSDone: func(dnsInfo httptrace.DNSDoneInfo) {
			fmt.Printf("DNS Info: %+v\n", dnsInfo)
		},
		WroteRequest: func(r httptrace.WroteRequestInfo) {
			fmt.Printf("WroteRequestInfo Info: %+v\n", r)
		},
		WroteHeaderField: func(k string, v []string) {
			fmt.Printf("WroteHeader Info: %v %v\n", k, v)
		},
		GotConn: func(connInfo httptrace.GotConnInfo) {
			fmt.Printf("Got Conn: %+v\n", connInfo)
		},
	}
	ctx = httptrace.WithClientTrace(ctx, trace)

	// b, err := ioutil.ReadFile("/Users/iantay/Documents/1 Projects/client_secret_686234783976-ddpbvkbeaurb1ioa7578ems583fjnm7o.apps.googleusercontent.com.json")
	// if err != nil {
	// 	log.Fatalf("error initializing app (reading file): %v\n", err)
	// }
	// app, err := firebase.NewApp(context.Background(), &firebase.Config{ProjectID: "ian-firebase-auth-sdk"}, option.WithCredentialsJSON(b))
	app, err := firebase.NewApp(context.Background(), &firebase.Config{ProjectID: "ian-firebase-auth-sdk"})
	// app, err := firebase.NewApp(context.Background(), nil)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}

	client, err := app.Auth(ctx)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}
	iter := client.Users(ctx, "")
	for {
		user, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Fatalf("error listing users: %s\n", err)
		}
		log.Printf("read user user: %v\n", user)
	}

	// Iterating by pages 100 users at a time.
	// Note that using both the Next() function on an iterator and the NextPage()
	// on a Pager wrapping that same iterator will result in an error.
	pager := iterator.NewPager(client.Users(ctx, ""), 100, "")
	for {
		var users []*auth.ExportedUserRecord
		nextPageToken, err := pager.NextPage(&users)
		if err != nil {
			log.Fatalf("paging error %v\n", err)
		}
		for _, u := range users {
			log.Printf("read user user: %v\n", u)
		}
		if nextPageToken == "" {
			break
		}
	}
}
