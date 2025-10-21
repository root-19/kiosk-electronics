<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sport;

class SportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sports = [
            [
                'name' => 'Basketball',
                'description' => 'A team sport where two teams, most commonly of five players each, compete to shoot a ball through a hoop.',
            ],
            [
                'name' => 'Volleyball',
                'description' => 'A team sport in which two teams of six players are separated by a net.',
            ],
            [
                'name' => 'Football (Soccer)',
                'description' => 'A team sport played between two teams of 11 players with a spherical ball.',
            ],
            [
                'name' => 'Track and Field',
                'description' => 'A sport that includes athletic contests based on running, jumping, and throwing skills.',
            ],
            [
                'name' => 'Swimming',
                'description' => 'An individual or team racing sport that requires the use of one\'s entire body to move through water.',
            ],
            [
                'name' => 'Badminton',
                'description' => 'A racquet sport played using racquets to hit a shuttlecock across a net.',
            ],
        ];

        foreach ($sports as $sport) {
            Sport::create($sport);
        }
    }
}
